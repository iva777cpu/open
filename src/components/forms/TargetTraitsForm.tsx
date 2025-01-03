import React from "react";
import { Input } from "../ui/input";
import { questions } from "@/utils/questions";

interface TargetTraitsFormProps {
  userProfile: Record<string, string>;
  onUpdate: (field: string, value: string) => void;
}

export const TargetTraitsForm: React.FC<TargetTraitsFormProps> = ({ userProfile, onUpdate }) => {
  return (
    <div className="space-y-4">
      {questions.targetTraits.map((field) => (
        <div key={field.id}>
          <label className="block text-[#EDEDDD] mb-1 text-left">{field.text}</label>
          <Input
            type="text"
            value={userProfile[field.id] || ''}
            onChange={(e) => onUpdate(field.id, e.target.value)}
            className="bg-[#EDEDDD] text-[#1A2A1D] border-[#EDEDDD] placeholder-[#1A2A1D]/50 text-base placeholder:text-xs"
            placeholder={
              field.id === 'targetAge' ? 'Enter age' :
              field.id === 'targetGender' ? 'Enter gender' :
              field.examples
            }
            style={{
              fontSize: userProfile[field.id] ? '16px' : '12px'
            }}
          />
        </div>
      ))}
    </div>
  );
};