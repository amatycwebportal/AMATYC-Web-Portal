import { prisma } from "@lib/prisma";
import { assignAliasName } from "../../src/lib/assignAliasName";

const INSTITUTION_ID = "00000000-0000-0000-0000-000000000001";

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

type UserRole = "PROJECT_LEAD" | "LOCAL_LEADER" | "USER";

type SeedUser = {
  id: string;
  googleId: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId: string;
};

const users: SeedUser[] = [
  {
    id: USER_IDS.projectLead,
    googleId: "test-google-project-lead",
    name: "Project Lead",
    email: "project.lead@example.com",
    role: "PROJECT_LEAD",
    institutionId: INSTITUTION_ID,
  },
  {
    id: USER_IDS.localLeader,
    googleId: "test-google-local-leader",
    name: "College Lead",
    email: "local.leader@example.com",
    role: "LOCAL_LEADER",
    institutionId: INSTITUTION_ID,
  },
  {
    id: USER_IDS.faculty,
    googleId: "test-google-faculty",
    name: "User",
    email: "member@example.com",
    role: "USER",
    institutionId: INSTITUTION_ID,
  },
  {
    id: USER_IDS.user,
    googleId: "test-google-user",
    name: "User",
    email: "user@example.com",
    role: "USER",
    institutionId: INSTITUTION_ID,
  },
  {
    id: USER_IDS.localLeaderInstitution2,
    googleId: "test-google-local-leader-inst-2",
    name: "College Lead (Riverside College)",
    email: "local.leader.riverside@example.com",
    role: "LOCAL_LEADER",
    institutionId: EXTRA_INSTITUTION_IDS[0],
  },
  {
    id: USER_IDS.localLeaderInstitution3,
    googleId: "test-google-local-leader-inst-3",
    name: "College Lead (Northfield University)",
    email: "local.leader.northfield@example.com",
    role: "LOCAL_LEADER",
    institutionId: EXTRA_INSTITUTION_IDS[1],
  },
  {
    id: USER_IDS.localLeaderInstitution4,
    googleId: "test-google-local-leader-inst-4",
    name: "College Lead (Central State Institute)",
    email: "local.leader.central@example.com",
    role: "LOCAL_LEADER",
    institutionId: EXTRA_INSTITUTION_IDS[2],
  },
  {
    id: USER_IDS.localLeaderInstitution5,
    googleId: "test-google-local-leader-inst-5",
    name: "College Lead (Lakeview Polytechnic)",
    email: "local.leader.lakeview@example.com",
    role: "LOCAL_LEADER",
    institutionId: EXTRA_INSTITUTION_IDS[3],
  },
  {
    id: USER_IDS.localLeaderInstitution6,
    googleId: "test-google-local-leader-inst-6",
    name: "College Lead (Summit Teaching College)",
    email: "local.leader.summit@example.com",
    role: "LOCAL_LEADER",
    institutionId: EXTRA_INSTITUTION_IDS[4],
  },
];

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        role: user.role,
        institutionId: user.institutionId,
      },
      create: {
        id: user.id,
        googleId: user.googleId,
        name: user.name,
        email: user.email,
        role: user.role,
        institutionId: user.institutionId,
      },
    });
    await assignAliasName({
      userId: user.id,
      institutionId: user.institutionId,
      seed: user.email,
    });
  }

  console.log(`User seed complete — ${users.length} users upserted with aliases`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
