/**
 * Implementação da requisição na web
 */

function jsonp(url, timeout) {
  // Gera um nome aleatório para a função de callback
  const func = 'jsonp_' + Math.random().toString(36).substr(2, 5);

  return new Promise(function(resolve, reject) {
    // Cria um script
    let script = document.createElement('script');

    // Cria um timer para controlar o tempo limite
    let timer = setTimeout(() => {
      reject('Tempo limite atingido');
      document.body.removeChild(script);
    }, timeout);

    // Cria a função de callback
    window[func] = (json) => {
      clearTimeout(timer);
      resolve(json);
      document.body.removeChild(script);
      delete window[func];
    };

    // Adiciona o script na página para inicializar a solicitação
    script.src = url + '?callback=' + encodeURI(func);
    document.body.appendChild(script);
  });
}

/**
 * Consulta um CNPJ
 */
function consultaCNPJ(cnpj) {
  // Limpa o CNPJ para conter somente numeros, removendo traços e pontos
  cnpj = cnpj.replace(/\D/g, '');

  // Consulta o CNPJ na ReceitaWS com 60 segundos de tempo limite
  return jsonp('https://www.receitaws.com.br/v1/cnpj/' + encodeURI(cnpj), 60000)
    .then((json) => {
      if (json['status'] === 'ERROR') {
        return Promise.reject(json['message']);
      } else {
        return Promise.resolve(json);
      }
    });
}

/**
 * Consulta um CEP
 */
function consultaCEP(cep) {
  // Limpa o CEP para conter somente numeros, removendo traços e pontos
  cep = cep.replace(/\D/g, '');

  // Como a API retorna 404 com CEPs com tamanhos inválidos
  // Iremos validar antes para não ter que esperar o tempo limite do JSONP
  if (cep.length !== 8) return Promise.reject('CEP inválido');

  // Consulta o CEP na ViaCEP com 30 segundos de tempo limite
  return jsonp('https://viacep.com.br/ws/' + encodeURI(cep) + '/json/', 30000)
    .then((json) => {
      if (json['erro'] === true) {
        return Promise.reject('CEP não encontrado');
      } else {
        return Promise.resolve(json);
      }
    });
}

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
