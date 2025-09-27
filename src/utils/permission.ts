import { useUserStore } from "@/stores/modules/user.store";



export const isPermitted = (allowedRoles: any, roles = useUserStore().roles) => {
    if (roles.some((role: string) => allowedRoles.includes(role))) {
        return true;
    } else {
        for (const role of roles) {
            for (const allowRole of allowedRoles) {
                if (isSubGroup(allowRole, role)) {
                    return true;
                }
            }
        }
    }
    return false;
};


export const isSubGroup = (role1: number, role2: number) => {
    const rolesChain = {
        superuser: 100,
        admin: 90,
        staff: 60,
        manager: 70,
        agent: 50
    };
    return rolesChain[role2] >= rolesChain[role1];
};