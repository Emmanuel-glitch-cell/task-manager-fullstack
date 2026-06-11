export const manejoChange = (e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<string>>): void => {
    setState(e.target.value);  
}