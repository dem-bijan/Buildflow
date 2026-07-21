import Link from "next/link";

export default function CompteEnAttentePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0Z" />
                </svg>
            </div>
            <h1 className="text-xl font-bold">Votre demande est en cours de traitement</h1>
            <p className="text-sm text-content-muted dark:text-content-muted-dark max-w-md">
                Votre compte a été créé, mais le rôle que vous avez demandé nécessite une approbation.
                Un responsable doit valider votre demande avant que vous puissiez vous connecter.
            </p>
            <Link href="/" className="mt-2 px-5 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors">
                Retour à l&apos;accueil
            </Link>
        </div>
    );
}