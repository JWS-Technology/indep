export default function SectionTitle({ title, subtitle }) {
    return (
        <div className="text-center mb-10">
            {subtitle && (
                <p className="text-sm uppercase tracking-widest text-gray-500 mb-1">
                    {subtitle}
                </p>
            )}
            <h2 className="text-3xl font-bold tracking-tight">
                {title}
            </h2>
        </div>
    );
}