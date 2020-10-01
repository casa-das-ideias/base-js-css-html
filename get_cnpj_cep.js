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
