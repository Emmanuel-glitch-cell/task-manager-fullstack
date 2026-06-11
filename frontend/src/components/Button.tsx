interface Props {
    texto: string;
}
export default function Button({texto}: Props) {
    return <button type="submit" className="border bg-blue-600 text-black rounded-sm p-1 text-lg hover:bg-blue-400 hover:scale-102 transition-all cursor-pointer duration-300 active:scale-98">{texto}</button>
}