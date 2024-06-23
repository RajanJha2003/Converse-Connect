"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckCheck, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import ActionTooltip from "../action-tooltip";

export const InviteModal = () => {
  const router = useRouter();
  const [copied,setCopied]=useState(false);
  const { isOpen, onClose, type,data,onOpen } = useModal();
  const origin=useOrigin();
  const {server}=data;

  const [isLoading,setLoading]=useState(false);

  const isModalOpen = isOpen && type == "invite";

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy=()=>{
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);

      setTimeout(()=>{
        setCopied(false)
      },3000)
    }

    const onNew = async () => {
      try {
        setLoading(true);
        const response = await axios.patch(
          `/api/servers/${server?.id}/invite-code`
        );
  
        onOpen("invite", { server: response.data });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-200/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
              disabled={isLoading}
            />
          <ActionTooltip
                align="center"
                side="top"
                label={copied ? "copied" : "copy"}
              >
                <Button disabled={isLoading} onClick={onCopy} size="icon">
                  {copied ? (
                    <CheckCheck className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </ActionTooltip>
          </div>
          <Button  disabled={isLoading}  onClick={onNew} variant="link"  size="sm" className="text-xs text-zinc-500 mt-4" > 
            Generate a New Link
            <RefreshCw className="w-4 h-4 ml-2" />

          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
