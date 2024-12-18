export interface ITitleWithButtons {
    title: string;
    baseClass: string;
    parentClass: string;
    rootClass: string;
    buttonParentClass: string;
    buttonDivisionClass: string;
    buttons?: Array<ICustomButtons>;
}

export interface ICustomButtons {
    name: string;
    attr: any;
    buttonClass: string;
    parentClass: string;
    click: any;
}
