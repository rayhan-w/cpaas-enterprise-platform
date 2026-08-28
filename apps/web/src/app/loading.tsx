export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-semibold text-muted-foreground animate-pulse">
        Loading Solvear Platform...
      </p>
    </div>
  );
}
