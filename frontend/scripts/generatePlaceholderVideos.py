"""Generate short H.264 title-card MP4s without an external encoder.

Each clip is one intra frame stored as I_PCM macroblocks inside a baseline MP4.
"""

from __future__ import annotations

import struct
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

WIDTH = 640
HEIGHT = 352
FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
OUTPUT_DIR = Path(__file__).resolve().parents[1] / "public" / "videos"

CLIPS = [
    {
        "filename": "administrator-training.mp4",
        "title": "Administrator training",
        "subtitle": "Placeholder",
        "background": (15, 61, 92),
    },
    {
        "filename": "college-lead-access.mp4",
        "title": "Controlling what people see",
        "subtitle": "Placeholder",
        "background": (14, 92, 84),
    },
    {
        "filename": "first-time-walkthrough.mp4",
        "title": "First-time walkthrough",
        "subtitle": "Placeholder",
        "background": (72, 42, 110),
    },
    {
        "filename": "site-tour-color-coding.mp4",
        "title": "Site tour and color coding",
        "subtitle": "Placeholder",
        "background": (92, 48, 24),
    },
    {
        "filename": "rubric-guide.mp4",
        "title": "Guide to using the rubrics",
        "subtitle": "Placeholder",
        "background": (28, 78, 46),
    },
]


class BitWriter:
    def __init__(self) -> None:
        self.bits: list[int] = []

    def write_bits(self, value: int, count: int) -> None:
        for shift in range(count - 1, -1, -1):
            self.bits.append((value >> shift) & 1)

    def write_ue(self, value: int) -> None:
        code_number = value + 1
        bit_length = code_number.bit_length()
        self.write_bits(0, bit_length - 1)
        self.write_bits(code_number, bit_length)

    def write_se(self, value: int) -> None:
        if value <= 0:
            self.write_ue(-2 * value)
            return
        self.write_ue(2 * value - 1)

    def write_bytes(self, payload: bytes) -> None:
        for byte in payload:
            self.write_bits(byte, 8)

    def align_with_zeros(self) -> None:
        while len(self.bits) % 8 != 0:
            self.write_bits(0, 1)

    def write_trailing_bits(self) -> None:
        self.write_bits(1, 1)
        self.align_with_zeros()

    def to_bytes(self) -> bytes:
        if len(self.bits) % 8 != 0:
            raise ValueError("Bitstream is not byte aligned")
        output = bytearray()
        for index in range(0, len(self.bits), 8):
            byte = 0
            for bit in self.bits[index : index + 8]:
                byte = (byte << 1) | bit
            output.append(byte)
        return bytes(output)


def prevent_emulation(rbsp: bytes) -> bytes:
    output = bytearray()
    zero_count = 0
    for byte in rbsp:
        if zero_count >= 2 and byte <= 3:
            output.append(3)
            zero_count = 0
        output.append(byte)
        if byte == 0:
            zero_count += 1
        else:
            zero_count = 0
    return bytes(output)


def build_sps() -> bytes:
    writer = BitWriter()
    writer.write_bits(66, 8)
    writer.write_bits(0b11000000, 8)
    writer.write_bits(30, 8)
    writer.write_ue(0)
    writer.write_ue(0)
    writer.write_ue(0)
    writer.write_ue(0)
    writer.write_ue(1)
    writer.write_bits(0, 1)
    writer.write_ue((WIDTH // 16) - 1)
    writer.write_ue((HEIGHT // 16) - 1)
    writer.write_bits(1, 1)
    writer.write_bits(1, 1)
    writer.write_bits(0, 1)
    writer.write_bits(0, 1)
    writer.write_trailing_bits()
    return writer.to_bytes()


def build_pps() -> bytes:
    writer = BitWriter()
    writer.write_ue(0)
    writer.write_ue(0)
    writer.write_bits(0, 1)
    writer.write_bits(0, 1)
    writer.write_ue(0)
    writer.write_ue(0)
    writer.write_ue(0)
    writer.write_bits(0, 1)
    writer.write_bits(0, 2)
    writer.write_se(0)
    writer.write_se(0)
    writer.write_se(0)
    writer.write_bits(0, 1)
    writer.write_bits(0, 1)
    writer.write_bits(0, 1)
    writer.write_trailing_bits()
    return writer.to_bytes()


def rgb_to_yuv(red: int, green: int, blue: int) -> tuple[int, int, int]:
    luma = int(0.299 * red + 0.587 * green + 0.114 * blue)
    chroma_blue = int(128 - 0.168736 * red - 0.331264 * green + 0.5 * blue)
    chroma_red = int(128 + 0.5 * red - 0.418688 * green - 0.081312 * blue)
    return (
        min(255, max(0, luma)),
        min(255, max(0, chroma_blue)),
        min(255, max(0, chroma_red)),
    )


def build_slice(image: Image.Image) -> bytes:
    rgb = image.convert("RGB")
    writer = BitWriter()
    writer.write_ue(0)
    writer.write_ue(2)
    writer.write_ue(0)
    writer.write_bits(0, 4)
    writer.write_ue(0)
    writer.write_bits(0, 4)
    writer.write_bits(0, 1)
    writer.write_bits(0, 1)
    writer.write_se(0)

    mb_cols = WIDTH // 16
    mb_rows = HEIGHT // 16
    pixels = rgb.load()
    for mb_row in range(mb_rows):
        for mb_col in range(mb_cols):
            writer.write_ue(25)
            writer.align_with_zeros()
            luma = bytearray()
            chroma_blue = bytearray()
            chroma_red = bytearray()
            origin_x = mb_col * 16
            origin_y = mb_row * 16
            for y in range(16):
                for x in range(16):
                    red, green, blue = pixels[origin_x + x, origin_y + y]
                    y_value, cb_value, cr_value = rgb_to_yuv(red, green, blue)
                    luma.append(y_value)
            for y in range(8):
                for x in range(8):
                    sample_x = origin_x + x * 2
                    sample_y = origin_y + y * 2
                    red, green, blue = pixels[sample_x, sample_y]
                    _, cb_value, cr_value = rgb_to_yuv(red, green, blue)
                    chroma_blue.append(cb_value)
                    chroma_red.append(cr_value)
            writer.write_bytes(bytes(luma))
            writer.write_bytes(bytes(chroma_blue))
            writer.write_bytes(bytes(chroma_red))
    writer.write_trailing_bits()
    return writer.to_bytes()


def nal_unit(nal_header: int, rbsp: bytes) -> bytes:
    return bytes([nal_header]) + prevent_emulation(rbsp)


def box(box_type: bytes, payload: bytes) -> bytes:
    return struct.pack(">I4s", 8 + len(payload), box_type) + payload


def full_box(box_type: bytes, version: int, flags: int, payload: bytes) -> bytes:
    header = bytes(
        [
            version,
            (flags >> 16) & 0xFF,
            (flags >> 8) & 0xFF,
            flags & 0xFF,
        ]
    )
    return box(box_type, header + payload)


def build_avcc(sps: bytes, pps: bytes) -> bytes:
    payload = bytearray(
        [
            1,
            sps[0],
            sps[1],
            sps[2],
            0xFF,
            0xE1,
        ]
    )
    payload += struct.pack(">H", len(sps))
    payload += sps
    payload.append(1)
    payload += struct.pack(">H", len(pps))
    payload += pps
    return box(b"avcC", bytes(payload))


def build_avc1(width: int, height: int, sps: bytes, pps: bytes) -> bytes:
    compressor_name = bytearray(32)
    label = b"Placeholder"
    compressor_name[0] = len(label)
    compressor_name[1 : 1 + len(label)] = label
    sample_entry = b"\x00" * 6
    sample_entry += struct.pack(">H", 1)
    sample_entry += b"\x00" * 16
    sample_entry += struct.pack(">HH", width, height)
    sample_entry += struct.pack(">II", 0x00480000, 0x00480000)
    sample_entry += b"\x00" * 4
    sample_entry += struct.pack(">H", 1)
    sample_entry += bytes(compressor_name)
    sample_entry += struct.pack(">HH", 0x0018, 0xFFFF)
    sample_entry += build_avcc(sps, pps)
    return box(b"avc1", sample_entry)


def identity_matrix() -> bytes:
    return struct.pack(
        ">9i",
        0x00010000,
        0,
        0,
        0,
        0x00010000,
        0,
        0,
        0,
        0x40000000,
    )


def build_mp4(sample: bytes, sps: bytes, pps: bytes) -> bytes:
    duration = 3000
    ftyp = box(b"ftyp", b"isom" + struct.pack(">I", 512) + b"isomiso2avc1mp41")
    mdat = box(b"mdat", sample)
    sample_offset = len(ftyp) + 8

    mvhd = full_box(
        b"mvhd",
        0,
        0,
        struct.pack(">IIII", 0, 0, 1000, duration)
        + struct.pack(">IH", 0x00010000, 0x0100)
        + b"\x00" * 10
        + identity_matrix()
        + b"\x00" * 24
        + struct.pack(">I", 2),
    )
    tkhd = full_box(
        b"tkhd",
        0,
        0x7,
        struct.pack(">IIIII", 0, 0, 1, 0, duration)
        + b"\x00" * 8
        + struct.pack(">hhhh", 0, 0, 0, 0)
        + identity_matrix()
        + struct.pack(">II", WIDTH << 16, HEIGHT << 16),
    )
    mdhd = full_box(
        b"mdhd",
        0,
        0,
        struct.pack(">IIIIHH", 0, 0, 1000, duration, 0x55C4, 0),
    )
    hdlr = full_box(
        b"hdlr",
        0,
        0,
        struct.pack(">I4s", 0, b"vide") + b"\x00" * 12 + b"VideoHandler\x00",
    )
    vmhd = full_box(b"vmhd", 0, 1, struct.pack(">HHHH", 0, 0, 0, 0))
    url = full_box(b"url ", 0, 1, b"")
    dref = full_box(b"dref", 0, 0, struct.pack(">I", 1) + url)
    dinf = box(b"dinf", dref)
    stsd = full_box(b"stsd", 0, 0, struct.pack(">I", 1) + build_avc1(WIDTH, HEIGHT, sps, pps))
    stts = full_box(b"stts", 0, 0, struct.pack(">III", 1, 1, duration))
    stsc = full_box(b"stsc", 0, 0, struct.pack(">IIII", 1, 1, 1, 1))
    stsz = full_box(b"stsz", 0, 0, struct.pack(">III", 0, 1, len(sample)))
    stco = full_box(b"stco", 0, 0, struct.pack(">II", 1, sample_offset))
    stbl = box(b"stbl", stsd + stts + stsc + stsz + stco)
    minf = box(b"minf", vmhd + dinf + stbl)
    mdia = box(b"mdia", mdhd + hdlr + minf)
    trak = box(b"trak", tkhd + mdia)
    moov = box(b"moov", mvhd + trak)
    return ftyp + mdat + moov


def wrap_title(draw: ImageDraw.ImageDraw, title: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = title.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if draw.textlength(candidate, font=font) <= max_width:
            current = candidate
            continue
        if current:
            lines.append(current)
        current = word
    if current:
        lines.append(current)
    return lines


def render_title_card(title: str, subtitle: str, background: tuple[int, int, int]) -> Image.Image:
    image = Image.new("RGB", (WIDTH, HEIGHT), background)
    draw = ImageDraw.Draw(image)
    title_font = ImageFont.truetype(FONT_PATH, 48)
    subtitle_font = ImageFont.truetype(FONT_PATH, 28)
    lines = wrap_title(draw, title, title_font, WIDTH - 80)
    line_height = 58
    block_height = line_height * len(lines) + 48
    top = (HEIGHT - block_height) // 2
    for index, line in enumerate(lines):
        text_width = draw.textlength(line, font=title_font)
        draw.text(((WIDTH - text_width) / 2, top + index * line_height), line, font=title_font, fill=(255, 255, 255))
    subtitle_width = draw.textlength(subtitle, font=subtitle_font)
    draw.text(
        ((WIDTH - subtitle_width) / 2, top + len(lines) * line_height + 8),
        subtitle,
        font=subtitle_font,
        fill=(232, 220, 180),
    )
    return image


def generate_clip(filename: str, title: str, subtitle: str, background: tuple[int, int, int]) -> None:
    image = render_title_card(title, subtitle, background)
    sps = build_sps()
    pps = build_pps()
    slice_rbsp = build_slice(image)
    slice_nal = nal_unit(0x65, slice_rbsp)
    sample = struct.pack(">I", len(slice_nal)) + slice_nal
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUTPUT_DIR / filename).write_bytes(build_mp4(sample, sps, pps))


def main() -> None:
    for clip in CLIPS:
        generate_clip(clip["filename"], clip["title"], clip["subtitle"], clip["background"])
        print(clip["filename"])


if __name__ == "__main__":
    main()
