import { prisma } from "@lib/prisma";
import { Router } from "express";
import type { Request, Response } from "express";
import type { UserRole } from "@shared/types";
import crypto from "crypto";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

router.post("/create", async (req: Request, res: Response) => {
  const { name, localLeaderName, localLeaderEmail, invitedByuser } = req.body;
  if (!name) { // || !localLeaderName || !localLeaderEmail
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
  const institution = await prisma.institution.create({
    data: { name },
  });

  //Check if user already exists
//   const user = await prisma.user.findUnique({
//     where: { email: localLeaderEmail },
//   });
//   if (user) {
//     return res.status(409).json({ error: "User already exists" });
//   }

  //Create invitation
//   const invitation = await prisma.invitation.create({
//     data: { 
//         email: localLeaderEmail, 
//         institutionId: institution.id, 
//         role: "LOCAL_LEADER" as UserRole,
//         token: crypto.randomBytes(32).toString('hex'),
//         invitedByUser: {
//             connect: {
//                 id: invitedByuser.id,
//             },
//         },
//     },
//   });
  //invite email local leader to site call
  res.json({ status: "ok" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
