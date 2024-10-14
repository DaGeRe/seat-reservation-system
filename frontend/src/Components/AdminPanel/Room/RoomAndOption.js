export function roomToOption(room) {
    return room.id+'-'+room.remark;
};

export function optionToRoomId(option) {
    return option.includes('-') ? option.split('-')[0] : option;
};

export function isOptionEqualToValue_Room(option, value) {
    return option === value || '' === value;
};