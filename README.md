<h1 align="center">
  <image src="https://github.com/lucasiori/fastfeet-backend/blob/master/.github/fastfeet-backend.png" alt="FastFeet" width="500" />
</h1>

<h3 align="center">FastFeet</h3>

<blockquote align="center">Aplicação final desenvolvida durante o Bootcamp GoStack</blockquote>

<p align="center">
  <a href="#sobre-aplicacao">Sobre a aplicação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#comecando">Começando</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#entidades-rotas">Entidades e Rotas</a>
</p>

<br />

<h2 id="sobre-aplicacao">ℹ Sobre a aplicação</h2>
<p>A aplicação trata-se de um sistema de gerenciamento para transportadoras.</p>
<p>Na plataforma web, são cadastrados os entregadores, destinatário e encomendas. Também são listadas todas as encomendas cadastradas
e você pode consultar os detalhes, como produto, status e se a entrega teve/possui algum problema.</p>
<p>No aplicativo mobile, o usuário pode consultar o status da entrega e cadastrar problemas para a mesma, além de finalizar a entrega
enviando uma foto da assinatura do destinatário</p>

<br /> 

<h2 id="comecando">▶ Começando</h2>

<p>Antes de iniciar o serviço, é necessário configurar as variáveis ambientes no arquivo ".env".</p>
<p>Todas as variáveis que precisam de configuração estão listadas no arquivo ".env.example"</p>
<p>Acesse a pasta do projeto e execute o seguinte comando para instalar as dependências necessárias para o projeto:</p>
<p><code>npm install</code></p>
<p>Agora, com todas as dependências instaladas, para iniciar o serviço execute o comando:</p>
<p><code>npm start</code></p>
<p>O serviço será executado na porta 3333 do seu localhost.</p>
<p>Para iniciar o servidor de tarefas em background:</p>
<p><code>npm queue</code></p>

<br /> 

<h2 id="entidades-rotas">✅ Entidades e Rotas</h2>

<h3>Entidades</h3>

<ul>
  <li>
    <h4>Destinatários</h4>
    <table>
      <thead>
        <th>Propriedade</th>
        <th>Descrição</th>
      </thead>
      <tbody>
        <tr>
          <td>name</td>
          <td>Nome do destinatário (String)</td>
        </tr>
        <tr>
          <td>address</td>
          <td>Endereço do destinatário (String)</td>
        </tr>
        <tr>
          <td>number</td>
          <td>Número do endereço do destinatário (String)</td>
        </tr>
        <tr>
          <td>complement</td>
          <td>Complemento do endereço do destinatário (String)</td>
        </tr>
        <tr>
          <td>state</td>
          <td>Estado do destinatário (String)</td>
        </tr>
        <tr>
          <td>city</td>
          <td>Cidade do destinatário (String)</td>
        </tr>
        <tr>
          <td>zip_code</td>
          <td>CEP do destinatário (Number)</td>
        </tr>
      </tbody>
    </table>
  </li>
  
  <li>
    <h4>Entregadores</h4>
    <table>
      <thead>
        <th>Propriedade</th>
        <th>Descrição</th>
      </thead>
      <tbody>
        <tr>
          <td>name</td>
          <td>Nome do entregador (String)</td>
        </tr>
        <tr>
          <td>email</td>
          <td>Email do entregador (String)</td>
        </tr>
        <tr>
          <td>avatar_id</td>
          <td>ID do avatar no banco de dados (Number)</td>
        </tr>
      </tbody>
    </table>
  </li>
  
  <li>
    <h4>Entregas</h4>
    <table>
      <thead>
        <th>Propriedade</th>
        <th>Descrição</th>
      </thead>
      <tbody>
        <tr>
          <td>product</td>
          <td>Descrição do produto (String)</td>
        </tr>
        <tr>
          <td>canceled_at</td>
          <td>Data de cancelamento da entrega (Date)</td>
        </tr>
        <tr>
          <td>start_date</td>
          <td>Data de retirada (início) da entrega (Date)</td>
        </tr>
        <tr>
          <td>end_date</td>
          <td>Data de conclusão da entrega (Date)</td>
        </tr>
        <tr>
          <td>recipient_id</td>
          <td>ID do destinatário no banco de dados (Number)</td>
        </tr>
        <tr>
          <td>deliveryman_id</td>
          <td>ID do entregador no banco de dados (Number)</td>
        </tr>
        <tr>
          <td>signature_id</td>
          <td>ID da assinatura do destinatário no banco de dados (Number)</td>
        </tr>
      </tbody>
    </table>
  </li>
  
  <li>
    <h4>Problemas da Entrega</h4>
    <table>
      <thead>
        <th>Propriedade</th>
        <th>Descrição</th>
      </thead>
      <tbody>
        <tr>
          <td>description</td>
          <td>Descrição do problema (String)</td>
        </tr>
        <tr>
          <td>delivery_id</td>
          <td>ID da entrega no banco de dados (Number)</td>
        </tr>
      </tbody>
    </table>
  </li>
</ul>

<h3>Rotas</h3>

<h4>GET</h4>

<ul>
  <li>
    <span><strong>(base_url)/recipients</strong> - Retorna uma lista de destinatários</span> <br /><br />
  </li>
  
  <li>
    <span><strong>(base_url)/deliverymen</strong> - Retorna uma lista de entregadores</span> <br /><br />
  </li>
  
  <li>
    <span>
      <strong>(base_url)/deliverymen/(deliveryman_id)/deliveries</strong> - Retorna uma lista de entregas para o entregador
    </span> <br />
      &nbsp;&nbsp; <strong>Route Param:</strong> <br />
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>deliveryman_id:</strong> ID do entregador que deseja buscar as entregas <br />
     &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br /><br />
  </li>
  
  <li>
    <span>
      <strong>(base_url)/deliverymen/(deliveryman_id)/finished-deliveries</strong> - Retorna uma lista de entregas finalizadas para o entregador
    </span> <br />
     &nbsp;&nbsp; <strong>Route Param:</strong> <br />
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>deliveryman_id:</strong> ID do entregador que deseja buscar as entregas <br />
     &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br /><br />
  </li>
  
  <li>
    <span><strong>(base_url)/problems/deliveries</strong> - Retorna uma lista de entregas que possuem problemas</span> <br />
    &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br /><br />
  </li>
  
  <li>
    <span><strong>(base_url)/deliveries/(delivery_id)/problems</strong> - Retorna uma lista de problemas para a entrega</span> <br />
     &nbsp;&nbsp; <strong>Route Param:</strong> <br />
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>delivery_id:</strong> ID da entrega que deseja buscar os problemas <br />
     &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br /><br />
  </li>
</ul>

<h4>POST</h4>

<ul>
  <li>
    <span><strong>(base_url)/sessions</strong> - Iniciar uma nova sessão de login</span> <br />
     &nbsp;&nbsp; <strong>Body:</strong> Email e senha do usuário (JSON) <br />
     &nbsp;&nbsp; <strong>Retorno:</strong> Token de autenticação (JSON) <br /><br />
  </li>
  
  <li>
    <span><strong>(base_url)/recipients</strong> - Cadastrar um novo destinatário</span> <br />
     &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br />
     &nbsp;&nbsp; <strong>Body:</strong> Dados do destinatário (JSON) <br />
     &nbsp;&nbsp; <strong>Retorno:</strong> Dados do destinatário cadastrado (JSON) <br /><br />
  </li>
  
  <li>
    <span><strong>(base_url)/deliverymen</strong> - Cadastrar um novo entregador</span> <br />
     &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br />
     &nbsp;&nbsp; <strong>Body:</strong> Dados do entregador (JSON) <br />
     &nbsp;&nbsp; <strong>Retorno:</strong> Dados do entregador cadastrado (JSON) <br /><br />
  </li>
  
  <li>
    <span><strong>(base_url)/files</strong> - Realizar upload de uma nova imagem</span> <br />
     &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br />
     &nbsp;&nbsp; <strong>Body:</strong> Input com a imagem (Multipart Form) <br />
     &nbsp;&nbsp; <strong>Retorno:</strong> Dados da imagem cadastrada (JSON) <br /><br />
  </li>
  
  <li>
    <span><strong>(base_url)/deliveries</strong> - Cadastrar uma nova entrega</span> <br />
     &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br />
     &nbsp;&nbsp; <strong>Body:</strong> Dados da entrega (JSON) <br />
     &nbsp;&nbsp; <strong>Retorno:</strong> Dados da entrega cadastrada (JSON) <br /><br />
  </li>
  
  <li>
    <span><strong>(base_url)/deliveries/(delivery_id)/problems</strong> - Cadastrar um novo problema para a entrega</span> <br />
     &nbsp;&nbsp; <strong>Route Param:</strong> <br />
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>delivery_id:</strong> ID da entrega que deseja cadastrar o problema <br />
     &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br />
     &nbsp;&nbsp; <strong>Body:</strong> Dados do problema (JSON) <br />
     &nbsp;&nbsp; <strong>Retorno:</strong> Dados do problema cadastrado (JSON) <br /><br />
  </li>
</ul>

<h4>PUT</h4>

<ul>
  <li>
    <span><strong>(base_url)/recipients/(recipient_id)</strong> - Atualizar um registro de destinatário</span> <br />
      &nbsp;&nbsp; <strong>Route Param:</strong> <br />
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>recipient_id:</strong> ID do destinatário que será atualizado <br />
     &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br />
     &nbsp;&nbsp; <strong>Body:</strong> Dados do destinatário (JSON) <br />
     &nbsp;&nbsp; <strong>Retorno:</strong> Dados do destinatário atualizado (JSON) <br /><br />
  </li>
  
  <li>
    <span><strong>(base_url)/deliverymen/(deliveryman_id)	</strong> - Atualizar um registro de entregador</span> <br />
     &nbsp;&nbsp; <strong>Route Param:</strong> <br />
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>deliveryman_id:</strong> ID do entregador que será atualizado <br />
     &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br />
     &nbsp;&nbsp; <strong>Body:</strong> Dados do entregador (JSON) <br />
     &nbsp;&nbsp; <strong>Retorno:</strong> Dados do entregador atualizado (JSON) <br /><br />
  </li>
  
  <li>
    <span><strong>(base_url)/deliveries/(delivery_id)/start	</strong> - Atualizar status da entrega para iniciado </span> <br />
     &nbsp;&nbsp; <strong>Route Param:</strong> <br />
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>delivery_id:</strong> ID da entrega que será atualizada <br />
     &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br />
     &nbsp;&nbsp; <strong>Retorno:</strong> Dados da entrega atualizada (JSON) <br /><br />
  </li>
  
  <li>
    <span><strong>(base_url/deliveries/(delivery_id)/finish	</strong> - Atualizar status da entrega para finalizado </span> <br />
     &nbsp;&nbsp; <strong>Route Param:</strong> <br />
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>delivery_id:</strong> ID da entrega que será atualizada <br />
     &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br />
     &nbsp;&nbsp; <strong>Retorno:</strong> Dados da entrega atualizada (JSON) <br /><br />
  </li>
</ul>

<h4>DELETE</h4>

<ul>
  <li>
    <span><strong>(base_url)/recipients/(recipient_id)</strong> - Deletar um registro de destinatário </span> <br />
     &nbsp;&nbsp; <strong>Route Param:</strong> <br />
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>recipient_id:</strong> ID do destinatário que será deletado <br />
     &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br />
     &nbsp;&nbsp; <strong>Retorno:</strong> Status 200, sem conteúdo. <br /><br />
  </li>
  
  <li>
    <span><strong>(base_url)/deliverymen/(deliveryman_id)</strong> - Deletar um registro de entregador </span> <br />
     &nbsp;&nbsp; <strong>Route Param:</strong> <br />
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>deliveryman_id:</strong> ID do entregador que será deletado <br />
     &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br />
     &nbsp;&nbsp; <strong>Retorno:</strong> Status 200, sem conteúdo. <br /><br />
  </li>
  
  <li>
    <span><strong>(base_url)/deliveries/(delivery_id)</strong> - Deletar um registro de entrega (Cancelamento) </span> <br />
     &nbsp;&nbsp; <strong>Route Param:</strong> <br />
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>delivery_id:</strong> ID da entrega que será deletada (cancelada) <br />
     &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br />
     &nbsp;&nbsp; <strong>Retorno:</strong> Status 200, sem conteúdo. <br /><br />
  </li>
  
  <li>
    <span><strong>(base_url)/problems/(problems_id)/cancel-delivery</strong> - Deletar um registro de entrega (Cancelamento) </span> <br />
     &nbsp;&nbsp; <strong>Route Param:</strong> <br />
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>problems_id:</strong> ID do problema pertencente à entrega que será deletada (cancelada) <br />
     &nbsp;&nbsp; <strong>Autenticação:</strong> Bearer token Jwt <br />
     &nbsp;&nbsp; <strong>Retorno:</strong> Status 200, sem conteúdo. <br /><br />
  </li>
</ul>
