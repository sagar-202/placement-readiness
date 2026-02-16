
interface ContextHeaderProps {
    title: string;
    description: string;
    step?: string;
}

export const ContextHeader = ({ title, description, step }: ContextHeaderProps) => {
    return (
        <div className="w-full bg-background pt-sp-6 pb-sp-4 border-b border-border/40">
            <div className="container px-sp-4 md:px-sp-8 max-w-7xl mx-auto">
                {step && (
                    <span className="text-xs font-bold tracking-widest text-primary uppercase mb-2 block">
                        {step}
                    </span>
                )}
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
                    {title}
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};
