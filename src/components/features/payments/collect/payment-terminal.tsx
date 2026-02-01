import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, CreditCard, Printer, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface CartItem {
    id: string;
    label: string;
    subLabel?: string;
    amount: number;
    type: 'monthly_fee' | 'admission' | 'fine';
    classId?: string;
    monthIndex?: number;
}

interface PaymentTerminalProps {
    items: CartItem[];
    onRemoveItem: (id: string) => void;
    onComplete: (cashReceived: number) => void;
    onClear: () => void;
}

export function PaymentTerminal({ items, onRemoveItem, onComplete, onClear }: PaymentTerminalProps) {
    const [cashReceived, setCashReceived] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    const totalAmount = items.reduce((acc, item) => acc + item.amount, 0);
    const cashValue = parseInt(cashReceived) || 0;
    const balance = cashValue - totalAmount;
    
    const isValid = items.length > 0 && cashValue >= totalAmount;

    // Quick Cash Helpers
    const fillCash = (amount: number) => {
        setCashReceived(amount.toString());
        inputRef.current?.focus();
    };

    // Keyboard Shortcuts for Terminal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && isValid) {
                e.preventDefault();
                onComplete(cashValue);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isValid, cashValue, onComplete]);

    return (
        <div className="flex h-full flex-col bg-card">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-2">
                    <div className="rounded-md bg-primary/10 p-2 text-primary">
                        <Printer className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold leading-none">Current Session</h3>
                        <p className="text-xs text-muted-foreground" suppressHydrationWarning>ID: #ORD-{new Date().getTime().toString().slice(-6)}</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClear} disabled={items.length === 0} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                </Button>
            </div>

            {/* Cart Items (Scrollable) */}
            <ScrollArea className="flex-1 p-4">
                {items.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground opacity-50">
                        <CreditCard className="h-10 w-10" />
                        <p className="text-sm font-medium">No items selected</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={item.id} className="group flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm transition-all hover:border-destructive/50">
                                <div>
                                    <div className="font-medium">{item.label}</div>
                                    {item.subLabel && <div className="text-xs text-muted-foreground">{item.subLabel}</div>}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="font-mono font-bold">
                                        {item.amount.toLocaleString()} <span className="text-xs text-muted-foreground">LKR</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() => onRemoveItem(item.id)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Payment Calculation (Fixed Bottom) */}
            <div className="border-t bg-muted/20 p-4 shadow-inner">
                <div className="mb-4 flex items-end justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
                    <span className="text-3xl font-bold tracking-tight text-foreground">
                        {totalAmount.toLocaleString()} <span className="text-lg font-normal text-muted-foreground">LKR</span>
                    </span>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                ref={inputRef}
                                type="number"
                                className={cn(
                                    "h-14 pl-4 text-right text-2xl font-bold tracking-widest transition-colors",
                                    balance >= 0 ? "border-green-500/50 bg-green-50/50 focus-visible:ring-green-500" : "bg-background"
                                )}
                                placeholder="0"
                                value={cashReceived}
                                onChange={(e) => setCashReceived(e.target.value)}
                            />
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                                CASH
                            </div>
                        </div>
                        
                        {/* Quick Cash Buttons */}
                        <div className="flex gap-2">
                             {[500, 1000, 2000, 5000].map((amt) => (
                                 <Button
                                    key={amt}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs font-semibold"
                                    onClick={() => fillCash(amt)}
                                 >
                                     {amt}
                                 </Button>
                             ))}
                             <Button
                                 variant="outline"
                                 size="sm"
                                 className="flex-1 text-xs font-semibold"
                                 onClick={() => fillCash(totalAmount)}
                             >
                                 Exact
                             </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border bg-background p-3">
                        <span className="text-sm font-medium">Balance</span>
                        <span className={cn(
                            "text-xl font-bold font-mono",
                            balance < 0 ? "text-destructive" : "text-green-600"
                        )}>
                            {balance > 0 ? `+${balance.toLocaleString()}` : balance.toLocaleString()}
                        </span>
                    </div>

                    <Button 
                        size="lg" 
                        className="w-full h-16 text-lg font-bold shadow-lg shadow-primary/20" 
                        disabled={!isValid}
                        onClick={() => onComplete(cashValue)}
                    >
                        {isValid ? (
                            <>
                                <Printer className="mr-2 h-6 w-6" />
                                COMPLETE PAYMENT
                            </>
                        ) : (
                            <span className="opacity-80">Enter Cash Received</span>
                        )}
                    </Button>
                    
                    {isValid && (
                         <div className="text-center text-xs text-muted-foreground animate-pulse">
                             Press <span className="font-mono font-bold">Enter</span> to print receipt
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
}
