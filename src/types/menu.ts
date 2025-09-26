
export interface IMenuItem {
    key: string;
    icon?: Component;
    label: string;
    name: string;
    path?: string;
    namePath?: string[];
    children?: IMenuItem[];
}
