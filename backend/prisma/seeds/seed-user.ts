import { prisma } from "@lib/prisma";

const INSTITUTION_ID = "00000000-0000-0000-0000-000000000001";

// Keep IDs stable so `upsert` and `UserCourseBin` assignments are idempotent.
const USER_IDS = {
  projectLead: "10000000-0000-0000-0000-000000000001",
  localLeader: "10000000-0000-0000-0000-000000000002",
  faculty: "10000000-0000-0000-0000-000000000003",
  user: "10000000-0000-0000-0000-000000000004",
  localLeaderInstitution2: "10000000-0000-0000-0000-000000000012",
  localLeaderInstitution3: "10000000-0000-0000-0000-000000000013",
  localLeaderInstitution4: "10000000-0000-0000-0000-000000000014",
  localLeaderInstitution5: "10000000-0000-0000-0000-000000000015",
  localLeaderInstitution6: "10000000-0000-0000-0000-000000000016",
} as const;

const EXTRA_INSTITUTION_IDS = [
  "00000000-0000-0000-0000-000000000002",
  "00000000-0000-0000-0000-000000000003",
  "00000000-0000-0000-0000-000000000004",
  "00000000-0000-0000-0000-000000000005",
  "00000000-0000-0000-0000-000000000006",
] as const;

const COURSE_BINS = [
    { id: "70000000-0000-0000-0000-000000000001", name: "Into Geometry", predefinedBinId: "20000000-0000-0000-0000-000000000001" },
    { id: "70000000-0000-0000-0000-000000000002", name: "Intro Calculus", predefinedBinId: "20000000-0000-0000-0000-000000000001" },
    { id: "70000000-0000-0000-0000-000000000003", name: "Advanced Calculus", predefinedBinId: "20000000-0000-0000-0000-000000000004" },
  ] as const;

type UserRole = "PROJECT_LEAD" | "LOCAL_LEADER" | "FACULTY" | "USER";

type SeedUser = {
  id: string;
  googleId: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId: string;
  courseBinIds: string[]; // empty array => no courses assigned
};

const users: SeedUser[] = [
  {
    id: USER_IDS.projectLead,
    googleId: "test-google-project-lead",
    name: "Project Lead",
    email: "project.lead@example.com",
    role: "PROJECT_LEAD",
    institutionId: INSTITUTION_ID,
    courseBinIds: []
  },
  {
    id: USER_IDS.localLeader,
    googleId: "test-google-local-leader",
    name: "Local Leader",
    email: "local.leader@example.com",
    role: "LOCAL_LEADER",
    institutionId: INSTITUTION_ID,
    courseBinIds: [COURSE_BINS[0].id],
  },
  {
    id: USER_IDS.faculty,
    googleId: "test-google-faculty",
    name: "Faculty",
    email: "faculty@example.com",
    role: "FACULTY",
    institutionId: INSTITUTION_ID,
    courseBinIds: [COURSE_BINS[0].id],
  },
  {
    id: USER_IDS.user,
    googleId: "test-google-user",
    name: "User",
    email: "user@example.com",
    role: "USER",
    institutionId: INSTITUTION_ID,
    courseBinIds: [COURSE_BINS[1].id],
  },
  {
    id: USER_IDS.localLeaderInstitution2,
    googleId: "test-google-local-leader-inst-2",
    name: "Local Leader (Riverside College)",
    email: "local.leader.riverside@example.com",
    role: "LOCAL_LEADER",
    institutionId: EXTRA_INSTITUTION_IDS[0],
    courseBinIds: [],
  },
  {
    id: USER_IDS.localLeaderInstitution3,
    googleId: "test-google-local-leader-inst-3",
    name: "Local Leader (Northfield University)",
    email: "local.leader.northfield@example.com",
    role: "LOCAL_LEADER",
    institutionId: EXTRA_INSTITUTION_IDS[1],
    courseBinIds: [],
  },
  {
    id: USER_IDS.localLeaderInstitution4,
    googleId: "test-google-local-leader-inst-4",
    name: "Local Leader (Central State Institute)",
    email: "local.leader.central@example.com",
    role: "LOCAL_LEADER",
    institutionId: EXTRA_INSTITUTION_IDS[2],
    courseBinIds: [],
  },
  {
    id: USER_IDS.localLeaderInstitution5,
    googleId: "test-google-local-leader-inst-5",
    name: "Local Leader (Lakeview Polytechnic)",
    email: "local.leader.lakeview@example.com",
    role: "LOCAL_LEADER",
    institutionId: EXTRA_INSTITUTION_IDS[3],
    courseBinIds: [],
  },
  {
    id: USER_IDS.localLeaderInstitution6,
    googleId: "test-google-local-leader-inst-6",
    name: "Local Leader (Summit Teaching College)",
    email: "local.leader.summit@example.com",
    role: "LOCAL_LEADER",
    institutionId: EXTRA_INSTITUTION_IDS[4],
    courseBinIds: [],
  },
];

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        googleId: user.googleId,
        name: user.name,
        email: user.email,
        role: user.role,
        institutionId: user.institutionId,
      },
    });
  }

  const allUserIds = users.map((u) => u.id);
  await prisma.userCourseBin.deleteMany({
    where: {
      userId: { in: allUserIds },
    },
  });

  const assignments = users.flatMap((user) =>
    user.courseBinIds.map((courseBinId) => ({
      userId: user.id,
      courseBinId,
    })),
  );

  if (assignments.length > 0) {
    await prisma.userCourseBin.createMany({
      data: assignments,
      skipDuplicates: true,
    });
  }

  console.log(
    `User seed complete — ${users.length} users upserted; ${assignments.length} course-bin assignments created`,
  );
  console.log(`Project lead course assignments: ${assignments.filter((a) => a.userId === USER_IDS.projectLead).length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
