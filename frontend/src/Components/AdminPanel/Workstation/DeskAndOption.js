export function deskToOption(desk) {
    return desk.id.toString() + (!desk.remark ? '' : '-' + desk.remark);
};

export function optionToDeskId(option) {
    return option.includes('-') ? option.split('-')[0] : option;
};