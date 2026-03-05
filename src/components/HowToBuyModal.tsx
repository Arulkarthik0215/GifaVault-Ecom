import { useState } from 'react';
import { HelpCircle, MessageCircle, Send, Users, ChevronRight } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog';

const steps = [
    {
        icon: MessageCircle,
        title: 'Click "Buy on WhatsApp"',
        description: 'Found a product you love? Click the green "Buy on WhatsApp" button on the product page.',
        color: 'text-[#25D366]',
        bg: 'bg-[#25D366]/10',
    },
    {
        icon: Send,
        title: 'Send the message',
        description: 'WhatsApp will open with a pre-filled message containing the product details and link. Just hit send!',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    {
        icon: Users,
        title: 'Our team connects with you',
        description: 'Our team will respond shortly to confirm availability, discuss pricing, and arrange delivery.',
        color: 'text-gold',
        bg: 'bg-gold/10',
    },
];

const HowToBuyModal = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gold hover:text-gold/80 transition-colors group"
                    aria-label="How to buy guide"
                >
                    <HelpCircle className="w-3.5 h-3.5" />
                    How to Buy
                    <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-['Outfit'] text-xl font-semibold tracking-tight">
                        How to Buy
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        Buying from GifaVault is simple — just 3 easy steps!
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-4 items-start">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${step.bg} flex items-center justify-center`}>
                                <step.icon className={`w-5 h-5 ${step.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-xs font-bold text-muted-foreground/60">
                                        STEP {index + 1}
                                    </span>
                                </div>
                                <h4 className="font-medium text-sm text-foreground leading-tight">
                                    {step.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4">
                    <p className="text-xs text-muted-foreground text-center">
                        💬 Have questions? Reach out to us anytime on{' '}
                        <a
                            href="https://www.instagram.com/gifavault/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold hover:underline font-medium"
                        >
                            Instagram
                        </a>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HowToBuyModal;
