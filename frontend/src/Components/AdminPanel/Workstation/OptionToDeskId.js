export default function optionToDeskId(option) {
    return option.includes('-') ? option.split('-')[0] : option 
}