<p align="center">
  <img src="https://github.com/lucasiori/gobarber-backend/blob/master/gostack-node.png" alt="GoStack">
</p>

<h1>FastFeet - Backend</h1>

<p>
  Backend da aplicação final do Bootcamp GoStack 2020.
</p>
<p>
  Aplicação para gerenciamento de encomendas, onde são cadastrados os destinatários, entregadores e encomendas. Os cadastros são feitos apenas
  pelo administrador da plataforma.
</p>

<h3>Começando</h3>

<p>Configurar as variáveis ambientes (listadas no arquivo ".env.example").</p>

<p>Instalar as dependências</p>

```sh
yarn install
```

<p>Executar a aplicação</p>

```sh
yarn dev
```

<p>Executar o servidor de <i>jobs</i> em <i>background</i></p>

```sh
yarn queue
```

<h3>Objetos</h3>

<ul>
  <li>
    <h4>Destinatários</h4>
    &nbsp; name: String <br />
    &nbsp; address: String <br />
    &nbsp; number: String <br />
    &nbsp; complement: String <br />
    &nbsp; state: String <br />
    &nbsp; city: String <br />
    &nbsp; zip_code: Number <br />
  </li>
  
  <li>
    <h4>Entregadores</h4>
    &nbsp; name: String <br />
    &nbsp; email: String <br />
    &nbsp; avatar_id: Number <br />
  </li>
  
  <li>
    <h4>Entregas</h4>
    &nbsp; product: String <br />
    &nbsp; canceled_at: Date <br />
    &nbsp; start_date: Date <br />
    &nbsp; end_date: Date <br />
    &nbsp; recipient_id: Number <br />
    &nbsp; deliveryman_id: Number <br />
    &nbsp; signature_id: Number <br />
  </li>
  
  <li>
    <h4>Problemas da Entrega</h4>
    &nbsp; description: String <br />
    &nbsp; delivery_id: Number <br />
  </li>
</ul>

<h3>Rotas</h3>

<ul>
  <li>
    <h5>Sessão</h5>
    <table>
      <thead>
        <th>Método</th>
        <th>URL</th>
        <th>Autenticação</th>
        <th>Corpo da Req.</th>
        <th>Retorno</th>
      </thead>
      <tbody>
        <tr>
          <td>POST</td>
          <td>(base_url)/sessions</td>
          <td></td>
          <td>Email e senha do administrador</td>
          <td>Objeto contendo token de autenticação</td>
        </tr>
      </tbody>
    </table>
  </li>
  
  <li>
    <h5>Destinatários</h5>
    <table>
      <thead>
        <th>Método</th>
        <th>URL</th>
        <th>Autenticação</th>
        <th>Corpo da Req.</th>
        <th>Retorno</th>
      </thead>
      <tbody>
        <tr>
          <td>GET</td>
          <td>(base_url)/recipients</td>
          <td></td>
          <td></td>
          <td>Lista de destinatários cadastrados</td>
        </tr>
        <tr>
          <td>POST</td>
          <td>(base_url)/recipients</td>
          <td>(Bearer) token Jwt</td>
          <td>Objeto de destinatário</td>
          <td>Objeto do destinatário cadastrado</td>
        </tr>
        <tr>
          <td>PUT</td>
          <td>(base_url)/recipients/(recipient_id)</td>
          <td>(Bearer) token Jwt</td>
          <td>Objeto de destinatário</td>
          <td>Objeto do destinatário atualizado</td>
        </tr>
        <tr>
          <td>DELETE</td>
          <td>(base_url)/recipients/(recipient_id)</td>
          <td>(Bearer) token Jwt</td>
          <td></td>
          <td>Status OK (200), sem informações</td>
        </tr>
      </tbody>
    </table>
  </li>
  
  <li>
    <h5>Entregadores</h5>
    <table>
      <thead>
        <th>Método</th>
        <th>URL</th>
        <th>Autenticação</th>
        <th>Corpo da Req.</th>
        <th>Retorno</th>
      </thead>
      <tbody>
        <tr>
          <td>GET</td>
          <td>(base_url)/deliverymen</td>
          <td></td>
          <td></td>
          <td>Lista de entregadores cadastrados</td>
        </tr>
        <tr>
          <td>POST</td>
          <td>(base_url)/deliverymen</td>
          <td>(Bearer) token Jwt</td>
          <td>Objeto de entregador</td>
          <td>Objeto do entregador cadastrado</td>
        </tr>
        <tr>
          <td>PUT</td>
          <td>(base_url)/deliverymen/(deliveryman_id)</td>
          <td>(Bearer) token Jwt</td>
          <td>Objeto de entregador</td>
          <td>Objeto do entregador atualizado</td>
        </tr>
        <tr>
          <td>DELETE</td>
          <td>(base_url)/deliverymen/(deliveryman_id)</td>
          <td>(Bearer) token Jwt</td>
          <td></td>
          <td>Status OK (200), sem informações</td>
        </tr>
      </tbody>
    </table>
  </li>
  
  <li>
    <h5>Arquivos</h5>
    <table>
      <thead>
        <th>Método</th>
        <th>URL</th>
        <th>Autenticação</th>
        <th>Corpo da Req.</th>
        <th>Retorno</th>
      </thead>
      <tbody>
        <tr>
          <td>POST</td>
          <td>(base_url)/files</td>
          <td>(Bearer) token Jwt</td>
          <td><i>Multipart Form</i> contendo o campo de imagem (nome: file)</td>
          <td>Objeto do arquivo cadastrado</td>
        </tr>
      </tbody>
    </table>
  </li>
  
  <li>
    <h5>Entregas</h5>
    <table>
      <thead>
        <th>Método</th>
        <th>URL</th>
        <th>Autenticação</th>
        <th>Corpo da Req.</th>
        <th>Retorno</th>
      </thead>
      <tbody>
        <tr>
          <td>GET</td>
          <td>(base_url)/deliverymen/(deliveryman_id)/deliveries</td>
          <td>(Bearer) token Jwt</td>
          <td></td>
          <td>Lista de entregas cadastradas, para o entregador informado</td>
        </tr>
        <tr>
          <td>GET</td>
          <td>(base_url)/deliverymen/(deliveryman_id)/finished-deliveries</td>
          <td>(Bearer) token Jwt</td>
          <td></td>
          <td>Lista de entregas finalizadas, para o entregador informado</td>
        </tr>
        <tr>
          <td>GET</td>
          <td>(base_url)/problems/deliveries</td>
          <td>(Bearer) token Jwt</td>
          <td></td>
          <td>Lista de entregas que possuem problemas cadastrados</td>
        </tr>
        <tr>
          <td>POST</td>
          <td>(base_url)/deliveries</td>
          <td>(Bearer) token Jwt</td>
          <td>Objeto de entrega</td>
          <td>Objeto da entrega cadastrada</td>
        </tr>
        <tr>
          <td>PUT</td>
          <td>(base_url)/deliveries/(delivery_id)/start</td>
          <td>(Bearer) token Jwt</td>
          <td></td>
          <td>Objeto da entrega iniciada</td>
        </tr>
        <tr>
          <td>PUT</td>
          <td>(base_url)/deliveries/(delivery_id)/finish</td>
          <td>(Bearer) token Jwt</td>
          <td></td>
          <td>Objeto da entrega finalizada</td>
        </tr>
        <tr>
          <td>DELETE</td>
          <td>(base_url)/deliveries/(delivery_id)</td>
          <td>(Bearer) token Jwt</td>
          <td></td>
          <td>Status OK (200), sem informações</td>
        </tr>
        <tr>
          <td>DELETE</td>
          <td>(base_url)/problems/(problems_id)/cancel-delivery</td>
          <td>(Bearer) token Jwt</td>
          <td></td>
          <td>Status OK (200), sem informações</td>
        </tr>
      </tbody>
    </table>
    <br/>
    <span>
       <strong>OBS:</strong> Quando é cadastrada uma nova entrega ou uma entrega existente é cancelada, o entregador recebe uma 
       notificação por email.
    </span>
  </li>
  
  <li>
    <h5>Problemas da Entrega</h5>
    <table>
      <thead>
        <th>Método</th>
        <th>URL</th>
        <th>Autenticação</th>
        <th>Corpo da Req.</th>
        <th>Retorno</th>
      </thead>
      <tbody>
        <tr>
          <td>GET</td>
          <td>(base_url)/deliveries/(delivery_id)/problems</td>
          <td>(Bearer) token Jwt</td>
          <td></td>
          <td>Lista de problemas cadastrados, para a entrega informada</td>
        </tr>
        <tr>
          <td>POST</td>
          <td>(base_url)/deliveries/(delivery_id)/problems</td>
          <td>(Bearer) token Jwt</td>
          <td>Objeto de problema da entrega</td>
          <td>Objeto do problema da entrega cadastrado</td>
        </tr>
      </tbody>
    </table>
  </li>
</ul>

