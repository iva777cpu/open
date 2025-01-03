import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

interface SavedIcebreakersProps {
  onBack: () => void;
}

export const SavedIcebreakers: React.FC<SavedIcebreakersProps> = ({ onBack }) => {
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());

  const { data: messages, refetch } = useQuery({
    queryKey: ["saved-messages"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("saved_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleDeleteSelected = async () => {
    try {
      const { error } = await supabase
        .from("saved_messages")
        .delete()
        .in("id", Array.from(selectedMessages));

      if (error) throw error;
      setSelectedMessages(new Set());
      refetch();
    } catch (error) {
      console.error("Failed to delete messages:", error);
    }
  };

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  return (
    <section className="space-y-4">
      <div className="section-header">
        <header className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-[#303D24] dark:text-[#EDEDDD] hover:bg-[#2D4531]"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-[18px] font-bold text-[#303D24] dark:text-[#EDEDDD]">Saved Icebreakers</h1>
        </header>

        {selectedMessages.size > 0 && (
          <Button
            onClick={handleDeleteSelected}
            className="bg-[#47624B] text-[#EDEDDD] hover:bg-[#2D4531] px-2 py-1 rounded-md text-xs h-6 text-[11px]"
          >
            Delete Selected ({selectedMessages.size})
          </Button>
        )}
      </div>

      <div className="content-section max-w-2xl mx-auto space-y-2">
        {messages?.map((message) => (
          <Card key={message.id} className="icebreaker-box p-3 bg-[#47624B] dark:bg-[#2D4531] text-[#EDEDDD]">
            <div className="flex items-start gap-2">
              <Checkbox
                checked={selectedMessages.has(message.id)}
                onCheckedChange={() => toggleMessageSelection(message.id)}
                className="mt-1 border-[#EDEDDD]"
              />
              <p className="flex-grow text-[15px]">{message.message_text}</p>
            </div>
          </Card>
        ))}

        {messages?.length === 0 && (
          <p className="text-center text-[#47624B] dark:text-[#EDEDDD]">No saved icebreakers yet.</p>
        )}
      </div>
    </section>
  );
};