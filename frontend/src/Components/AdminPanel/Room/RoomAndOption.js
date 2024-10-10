export function roomToOption(room) {
    return room.id+'-'+room.remark;
};

export function optionToRoomId(option) {
    return option.includes('-') ? option.split('-')[0] : option;
};