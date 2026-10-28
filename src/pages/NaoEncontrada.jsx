import { Link } from "react-router";

const NaoEncontrada = () => {
    return (
        <div>
            <h1>404</h1>
            <p>Página não encontrada</p>
            <Link to={"/"}>Voltar</Link>
        </div>
    );
}

export default NaoEncontrada;