export default function DashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
            <p className="text-muted-foreground">Bienvenido a tu gestión financiera. Próximamente...</p>
            <form action="api/auth/signout" method="post">
                <button className="button block" type="submit">
                    Sign out
                </button>
            </form>
        </div>
    );
}
