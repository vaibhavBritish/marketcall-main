import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface User {
    id: string,
    email: string,
    isAdmin: boolean,
    userType?: string
}

interface UseCheckAuthOptions {
    requireAdmin?: boolean;
    requireRole?: 'AFFILIATE' | 'ADVERTISER';
    redirectTo?: string;
}

const useCheckAuth = (options: UseCheckAuthOptions = {}) => {
    const { requireAdmin = false, requireRole, redirectTo } = options;
    const router = useRouter();
    const [user, setuser] = useState<User | null>(null)
    const [loading, setloading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/me", { credentials: "include" });
                const data = await res.json();

                if (!data.user) {
                    router.push("/auth/login?message=Please login first");
                    return;
                }

                
                if (requireAdmin && !data.user.isAdmin) {
                    router.push("/auth/login?message=Admin access required");
                    return;
                }

                
                if (requireRole && data.user.userType !== requireRole) {
                    
                    const currentUserType = data.user.userType;
                    if (currentUserType === "AFFILIATE") {
                        router.push("/dashboard/affiliate");
                    } else if (currentUserType === "ADVERTISER") {
                        router.push("/dashboard/advertiser");
                    } else if (data.user.isAdmin) {
                        router.push("/admin");
                    } else {
                        
                        const roleName = requireRole === 'AFFILIATE' ? 'Affiliate' : 'Advertiser';
                        router.push(redirectTo || "/auth/login?message=" + encodeURIComponent(`${roleName} access required`));
                    }
                    return;
                }

               
                if (!requireAdmin && !requireRole && data.user.userType) {
                    const userType = data.user.userType;
                    if (userType === "AFFILIATE") {
                        router.push("/dashboard/affiliate");
                    } else if (userType === "ADVERTISER") {
                        router.push("/dashboard/advertiser");
                    }
                }

                setuser(data.user);
            } catch (error) {
                console.log("Auth failed error", error);
                router.push("/auth/login?message=Authentication failed")
            } finally{
                setloading(false)
            }
        }
        checkAuth();
    }, [router, requireAdmin, requireRole, redirectTo])


    return {user, loading}
}

export default useCheckAuth
