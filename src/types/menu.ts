
export interface IMenuItem {
    key: string;
    icon?: Component;
    label: string;
    name: string;
    path?: string;
    namePath?: string[];
    children?: IMenuItem[];
}


export interface NavItem {
    title: string;
    href?: string;
    icon?: Component;
    isActive?: boolean;
    items?: NavItem[];
    permission?: string;
}
