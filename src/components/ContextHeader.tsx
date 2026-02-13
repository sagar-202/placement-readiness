interface ContextHeaderProps {
  headline: string;
  subtext: string;
}

const ContextHeader = ({ headline, subtext }: ContextHeaderProps) => {
  return (
    <section className="border-b px-sp-4 py-sp-4">
      <h1 className="font-heading text-foreground">{headline}</h1>
      <p className="mt-sp-1 text-base text-muted-foreground">{subtext}</p>
    </section>
  );
};

export default ContextHeader;
