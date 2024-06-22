import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    console.log("[SERVER_CREATION] Starting server creation with profile ID:", profile.id);

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
      include: {
        members: true,
      },
    });

    console.log("[SERVER_CREATION] Server created:", server);
    console.log("[SERVER_CREATION] Created members:", server.members);

    // Verify the role assignment
    const adminMember = server.members.find(member => member.profileId === profile.id);
    if (adminMember && adminMember.role !== MemberRole.ADMIN) {
      console.error("[SERVER_CREATION] Role assignment failed:", adminMember);
      return new NextResponse("Role assignment failed", { status: 500 });
    }

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
