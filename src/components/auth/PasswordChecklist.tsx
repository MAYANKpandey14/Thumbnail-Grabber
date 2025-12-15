import React from 'react';
import { Check, X } from 'lucide-react';
import { PasswordValidationResult, PASSWORD_REQUIREMENTS } from '@/lib/password-validator';
import { cn } from '@/lib/utils';

interface PasswordChecklistProps {
    validationResult: PasswordValidationResult;
    className?: string;
}

export const PasswordChecklist: React.FC<PasswordChecklistProps> = ({ validationResult, className }) => {
    return (
        <div className={cn("text-xs space-y-1 mt-2", className)}>
            <p className="font-medium text-muted-foreground mb-2">Password requirements:</p>
            {PASSWORD_REQUIREMENTS.map((req) => {
                const isMet = validationResult.rules[req.key as keyof typeof validationResult.rules];
                return (
                    <div
                        key={req.key}
                        className={cn(
                            "flex items-center gap-2 transition-colors",
                            isMet ? "text-green-500" : "text-muted-foreground"
                        )}
                    >
                        {isMet ? (
                            <Check className="w-3 h-3" />
                        ) : (
                            <X className="w-3 h-3" />
                        )}
                        <span>{req.label}</span>
                    </div>
                );
            })}
        </div>
    );
};
