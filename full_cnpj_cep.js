function jsonp(e,o){const t="jsonp_"+Math.random().toString(36).substr(2,5);return new Promise(function(n,d){let i=document.createElement("script"),c=setTimeout(()=>{d("Tempo limite atingido"),document.body.removeChild(i)},o);window[t]=(e=>{clearTimeout(c),n(e),document.body.removeChild(i),delete window[t]}),i.src=e+"?callback="+encodeURI(t),document.body.appendChild(i)})}

function consultaCNPJ(e){return e=e.replace(/\D/g,""),jsonp("https://www.receitaws.com.br/v1/cnpj/"+encodeURI(e),6e4).then(e=>"ERROR"===e.status?Promise.reject(e.message):Promise.resolve(e))}function consultaCEP(e){return 8!==(e=e.replace(/\D/g,"")).length?Promise.reject("CEP inválido"):jsonp("https://viacep.com.br/ws/"+encodeURI(e)+"/json/",3e4).then(e=>!0===e.erro?Promise.reject("CEP não encontrado"):Promise.resolve(e))}

var id_cnpj = document.getElementById("id_cnpj");
if (id_cnpj != null) {
    console.log(id_cnpj.value);
    id_cnpj.addEventListener("blur", (e) => {
        //e.value = "";
        //e.target.style.backgroundColor = "yellow";
        //console.log(id_cnpj.value);
        consultaCNPJ(id_cnpj.value).then(
            (json) => {
                //console.log(json);
                //console.log(json.bairro);
                document.getElementById("id_name").value = json.nome;
                document.getElementById("id_name_fantasy").value = json.fantasia;
                document.getElementById("id_company_size").value = json.porte;
                document.getElementById("id_company_legal_nature").value =
                    json.natureza_juridica;
                document.getElementById("id_company_situation").value = json.situacao;
            },
            (erro) => {
                console.log("ERRO_CNPJ:", erro);
            }
        );
    });
} else {
    str_id_cnpj = null;
}

var id_address_cep = document.getElementById("cal_preview");
if (id_address_cep != null) {
    id_address_cep.addEventListener("blur", (e) => {
        consultaCEP(id_address_cep.value).then(
            (json) => {
                //console.log(json)
                document.getElementById("id_address").value = json.logradouro;
                document.getElementById("id_address_neighborhood").value = json.bairro;
                document.getElementById("id_address_neighborhood").value = json.bairro;
                document.getElementById("id_address_number").focus();
            },
            (erro) => {
                console.log("ERRO_CEP:", erro);
            }
        );
    });
} else {
    str_id_address_cep = null;
}
