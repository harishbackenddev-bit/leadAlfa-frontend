import { cn } from "../../../../lib/utils";

const SectionCard = ({ title, className = "", titleClassName = "", children }) => {
  return (
    <section className={cn("rounded-2xl border border-gray-200 bg-white p-6", className)}>
      {title ? (
        <>
          <h3 className={cn("text-2xl font-medium text-gray-800", titleClassName)}>{title}</h3>
          <div className="mt-4 border-t border-gray-100" />
        </>
      ) : null}
      <div className={title ? "mt-4" : ""}>{children}</div>
    </section>
  );
};

export default SectionCard;
