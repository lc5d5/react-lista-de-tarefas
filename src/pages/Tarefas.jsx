/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { AXIOS } from "../services";
import { useNavigate } from "react-router";
import { BiPencil, BiTrash } from "react-icons/bi";

const Tarefas = () => {

    const [tarefas, setTarefas] = useState([]);
    const [formCriar, setFormCriar] = useState(false);
    const [formEditar, setFormEditar] = useState(false);
    const usuario = JSON.parse(sessionStorage.getItem("usuario")) || null;
    const tituloCriar = useRef(null);
    const descricaoCriar = useRef(null);
    const idEditar = useRef(null);
    const tituloEditar = useRef(null);
    const descricaoEditar = useRef(null);
    const navigate = useNavigate();

    function pesquisarTarefa(palavra) {
        if (palavra.length == 0) {
            setTarefas(tarefas);
            return;
        }
        if (palavra.length >= 3) {
            let tarefasFiltradas = tarefas.filter(tarefa => tarefa.titulo.toLowerCase().includes(palavra.toLowerCase()))
            setTarefas(tarefasFiltradas);
        }
    }

    async function buscarTarefas() {
        try {

            if (!usuario) {
                navigate("/");
            }

            const resposta = await AXIOS.get(`/tarefas?id=${usuario.id}`);
            setTarefas(resposta.data);

        } catch (error) {
            console.log("Error: ", error.message);
        }
    }

    async function criarTarefa() {
        event.preventDefault();
        try {
            let dados = {
                titulo: tituloCriar.current.value,
                descricao: descricaoCriar.current.value,
                usuario_id: usuario.id
            }

            const resposta = await AXIOS.post("/tarefas", dados);

            alert(resposta.data.mensagem);
            setFormCriar(false);
            buscarTarefas();

        } catch (error) {
            alert("Error: ", error.message);
        }
    }

    async function editarTarefa() {
        event.preventDefault();
        try {
            let dados = {
                id: idEditar.current.value,
                titulo: tituloEditar.current.value,
                descricao: descricaoEditar.current.value,
                usuario_id: usuario.id
            }

            const resposta = await AXIOS.put(`/tarefas/${dados.id}`, dados);

            alert(resposta.data.mensagem);
            setFormEditar(false);
            buscarTarefas();

        } catch (error) {
            alert("Error: ", error.message);
        }
    }

    async function deletarTarefa(id) {
        event.preventDefault();
        try {
            let resposta;
            if(confirm("Deseja realmente apagar")){
                resposta = await AXIOS.delete(`/tarefas/${id}`);
            }

            alert(resposta.data.mensagem);
            buscarTarefas();

        } catch (error) {
            alert("Error: ", error.message);
        }
    }
    

    useEffect(() => {
        buscarTarefas();
    }, []);

    return (
        <div>
            <header
                className="flex justify-between items-center py-4 px-15 bg-linear-to-r from-purple-900 via-purple-600 to-purple-900">
                <input
                    onChange={(event) => pesquisarTarefa(event.target.value)}
                    type="text"
                    placeholder="Pesquisar"
                    className="w-100 h-10 pl-4 rounded bg-white"
                />
                <button
                    onClick={() => setFormCriar(true)}
                    className="leading-10 bg-purple-800 rounded px-4 font-bold text-white duration-200 cursor-pointer hover:bg-purple-400 hover:text-black">Nova
                    Tarefa</button>
            </header>

            <main className="p-15 bg-slate-200">
                <h1 className="text-3xl font-bold mb-6">Tarefas</h1>
                <div id="tarefas" className="grid grid-cols-3 gap-4">
                    {
                        tarefas.length == 0 ? (
                            <div>Crie sua primeira tarefa</div>
                        ) : (
                            tarefas.map(tarefa => (
                                <div className="bg-white p-4 rounded-lg">
                                    <h3 className="font-bold mb-4">{tarefa.titulo}</h3>
                                    <p>{tarefa.descricao}</p>
                                    <div className="flex justify-end gap-3">
                                        <BiPencil
                                            onClick={() => {
                                                idEditar.current.value = tarefa.id,
                                                tituloEditar.current.value = tarefa.titulo,
                                                descricaoEditar.current.value = tarefa.descricao,
                                                setFormEditar(true);
                                            }}
                                            className="cursor-pointer hover:fill-purple-500"
                                        />
                                        <BiTrash
                                            onClick={() => deletarTarefa(tarefa.id)} className="cursor-pointer hover:fill-purple-500"
                                        />
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>
                <div
                    id="overlay"
                    onClick={() => {
                        setFormCriar(false);
                    }}
                    className={`w-full h-screen bg-black/70 fixed top-0 left-0 duration-200 ${formCriar ? "" : "opacity-0 invisible"}`}
                ></div>
                <div id="form-criar"
                    className={`w-100 p-4 rounded-lg bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 duration-200 delay-200 ${formCriar ? "" : "opacity-0 invisible"}`}>
                    <div className="flex justify-end">
                        <box-icon
                            name='x'
                            className="cursor-pointer"
                            onClick={() => setFormCriar(false)}
                        ></box-icon>
                    </div>
                    <form onSubmit={criarTarefa} className="flex flex-col">
                        <label for="titulo" className="uppercase text-xs font-bold mb-2 block">Titulo</label>
                        <input
                            ref={tituloCriar}
                            id="titulo"
                            type="text"
                            placeholder="Titulo da tarefa"
                            className="pl-3 h-10 border-2 border-slate-400 focus:border-purple-600 duration-150 rounded outline-none mb-4"
                            required
                        />
                        <label for="descricao" className="uppercase text-xs font-bold mb-2 block">Descrição</label>
                        <textarea
                            ref={descricaoCriar}
                            id="descricao"
                            className="pl-3 h-30 border-2 border-slate-400 focus:border-purple-600 duration-150 rounded outline-none mb-4"
                            required
                        ></textarea>
                        <button type="submit"
                            className="w-full h-10 rounded bg-purple-400 hover:bg-purple-600 duration-200 hover:text-white font-bold">Criar</button>
                    </form>
                </div>

                <div id="form-editar"
                    className={`w-100 p-4 rounded-lg bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 duration-200 delay-200 ${formEditar ? "" : "opacity-0 invisible"}`}>
                    <div className="flex justify-end">
                        <box-icon
                            name='x'
                            className="cursor-pointer"
                            onClick={() => setFormEditar(false)}
                        ></box-icon>
                    </div>
                    <form onSubmit={editarTarefa} className="flex flex-col">
                        <input type="hidden" ref={idEditar} />
                        <label
                            className="uppercase text-xs font-bold mb-2 block"
                        >
                            Titulo
                        </label>
                        <input
                            ref={tituloEditar}
                            type="text"
                            placeholder="Titulo da tarefa"
                            className="pl-3 h-10 border-2 border-slate-400 focus:border-purple-600 duration-150 rounded outline-none mb-4"
                            required
                        />
                        <label className="uppercase text-xs font-bold mb-2 block">Descrição</label>
                        <textarea
                            ref={descricaoEditar}
                            className="pl-3 h-30 border-2 border-slate-400 focus:border-purple-600 duration-150 rounded outline-none mb-4"
                            required></textarea>
                        <button type="submit"
                            className="w-full h-10 rounded bg-purple-400 hover:bg-purple-600 duration-200 hover:text-white font-bold">Editar</button>
                    </form>
                </div>
            </main>

        </div>
    );
}

export default Tarefas;