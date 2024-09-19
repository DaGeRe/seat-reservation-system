export default function deskToOption(desk) {
    return desk.id.toString() + (!desk.remark ? '' : '-' + desk.remark);
};