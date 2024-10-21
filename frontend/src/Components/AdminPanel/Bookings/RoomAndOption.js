export function roomToOption(room) {
    return room.id.toString() + (room.remark ? '-' + room.remark : '');
}

export function optionToRoomId(option) {
    return option.includes('-') ? option.split('-')[0] : option;
}