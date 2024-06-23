"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckCheck, Copy, RefreshCw, ShieldAlert, ShieldBan, ShieldCheck } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import ActionTooltip from "../action-tooltip";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";

const roleIconMap = {
  GUEST: <ShieldBan className="h-4 w-4 ml-2 text-gray-500" />,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500 " />,
};

export const MembersModal = () => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState("");

  const { isOpen, onClose, type,data,onOpen } = useModal();
  const origin=useOrigin();
  const {server}=data as { server: ServerWithMembersWithProfiles };

  

  const isModalOpen = isOpen && type == "members";

    

    
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black  overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
           Manage Members
          </DialogTitle>
          <DialogDescription className=" text-center text-zinc-500">
              {server?.members?.length} Members
            </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {
            server?.members.map((member)=>(
              <div key={member.id} className="flex items-center gap-x-2 mb-6">
                 <UserAvatar src={member.profile.imageUrl} />
                 <div className=" flex flex-col gap-y-1">
                 <div className="text-xs font-semibold flex items-center">
                 {member.profile.name}
                    <ActionTooltip label={member.role} side='top'>
                    {roleIconMap[member.role]}
                    </ActionTooltip>

                  </div>
                  <p className=" text-xs text-zinc-500 ">
                    {member.profile.email}
                  </p>
                  </div>

              </div>
            ))
          }

        </ScrollArea>
        <div className="p-6">
          Hello
        </div>
      </DialogContent>
    </Dialog>
  );
};
