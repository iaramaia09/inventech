// Dados fictícios, montagem das telas e interações da demonstração.
// Procure por dashboard(), stock() e reports() para editar cada tela.

const app=document.querySelector('#app'),modal=document.querySelector('#modal');
const seed=[['CNMG 120408','Pastilha de metal duro para torneamento','Sandvik Coromant',24,10],['TNMG 160408','Pastilha triangular para torneamento','ISCAR',8,10],['WNMG 080408','Pastilha de torneamento para aço','Kennametal',3,10],['VCMT 160404','Pastilha losangular positiva','Seco Tools',45,15],['DCMT 070204','Pastilha de alto avanço para torneamento','Mitsubishi Materials',12,8],['SNMG 120408','Pastilha quadrada para desbaste','Sandvik Coromant',6,12],['CCMT 09T304','Pastilha para acabamento','ISCAR',30,10],['RCMT 1204M0','Pastilha redonda para fresamento','Kennametal',9,10]];
let items=seed.map((x,i)=>({
  id:i,code:x[0],description:x[1],maker:x[2],qty:x[3],min:x[4]
}
));
let records=[[0,-6,30,'15/09/2026','08:42','Ana Oliveira'],[1,-4,12,'15/09/2026','07:15','Marcos Silva'],[3,20,25,'14/09/2026','16:30','Carlos Mendes'],[2,-7,10,'14/09/2026','14:10','Ana Oliveira'],[4,15,0,'13/09/2026','09:00','Carlos Mendes'],[5,-6,12,'13/09/2026','11:30','Marcos Silva'],[6,30,0,'12/09/2026','15:45','Carlos Mendes'],[7,-3,12,'12/09/2026','08:20','Ana Oliveira'],[0,10,20,'11/09/2026','10:00','Bianca'],[3,-2,27,'11/09/2026','09:20','Bianca']].map(x=>({
  code:items[x[0]].code,delta:x[1],before:x[2],date:x[3],time:x[4],person:x[5]
}
));
let page='login',filter='Todos',query='',period='all',reportItem='all';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}
[c]));
const status=i=>i.qty>=i.min?'Normal':i.qty<=i.min/2?'Crítico':'Estoque Baixo';
const badge=i=>`<span class="badge ${status(i)==='Normal'?'normal':status(i)==='Crítico'?'':'low'}">● ${status(i)}</span>`;
function toast(s){
  const t=document.querySelector('#toast');
  t.textContent=s;
  t.style.display='block';
  clearTimeout(toast.timer);
  toast.timer=setTimeout(()=>t.style.display='none',3500)
}
function go(p){
  page=p;
  render()
}
function stat(label,value,cls='',detail=''){
  return `<div class="stat"><h2>${label}</h2><strong class="${cls}">${value}</strong>${detail?`<p>${
    detail
  }
  </p>`:''}</div>`
}
function render(){
  if(page==='login'){
    app.innerHTML=`<main class="login"><section class="login-art"><h1>DDA<br>METALURGICA</h1><p>Uma experiencia mais facil e organizada para o seu gerenciamento</p></section><section class="login-form"><h2>Entrar na conta</h2><p>Informe suas credenciais de acesso</p><form id="login"><label for="email">E-mail</label><input id="email" type="email" placeholder="SeuEmail@gmail.com" autocomplete="username"><label for="password">Senha</label><input id="password" type="password" placeholder="*************" autocomplete="current-password"><button class="primary">Entrar</button></form><button class="forgot" onclick="recover()">Esqueceu a senha?</button><div class="demo-note">Demonstração visual · Clique em Entrar para conhecer o sistema.</div></section></main>`;
    document.querySelector('#login').onsubmit=e=>{
      e.preventDefault();
      go('Dashboard')
    }
    ;
    return
  }
  app.innerHTML=`<div class="shell"><aside class="sidebar"><div class="brand"><span class="brand-mark"></span>Inventech</div><nav class="nav" aria-label="Menu principal">${['Dashboard','Estoque','Relatórios','Movimentação','Fornecedores'].map(p=>`<button class="${page===p?'active':''}" onclick="${['Movimentação','Fornecedores'].includes(p)?`toast('Esta página ainda não está no protótipo.')`:`go('${p}')`}">${
    p
  }
  </button>`).join('')}</nav><div class="user-bottom"><div class="user-card"><span class="avatar"></span><div>Bianca<small>Administrador</small></div></div></div></aside><main class="main"><header><div class="heading"><button class="mobile-toggle" aria-label="Abrir ou fechar menu" onclick="document.querySelector('.shell').classList.toggle('menu')">☰</button><h1>${page==='Estoque'?'Estoque de pastilhas':page}</h1></div><div class="profile"><span class="avatar"></span><button title="Sair da demonstração" onclick="go('login')"><b>Bianca</b></button></div></header><div class="content">${page==='Dashboard'?dashboard():page==='Estoque'?stock():reports()}</div></main></div>`;
  if(page==='Estoque')document.querySelector('#search').addEventListener('input',e=>{
    query=e.target.value;
    document.querySelector('#stockbody').innerHTML=stockRows()
  }
  )
}
function dashboard(){
  return `<div class="stats">${stat('TOTAL DE PASTILHAS',items.length,'','Itens cadastrados')}${stat('ESTOQUE BAIXO',items.filter(i=>status(i)==='Estoque Baixo').length,'danger','Abaixo do mínimo')}${stat('ESTOQUE CRÍTICO',items.filter(i=>status(i)==='Crítico').length,'danger','Reposição urgente')}</div><div class="actions"><button class="green" onclick="movement(1)">+ Registrar Pastilha</button><button class="red" onclick="movement(-1)">- Registrar Saída</button><button class="outline" onclick="edit()">+ Nova Pastilha</button></div><section class="panel"><div class="panel-title"><h2>Alertas de Estoque</h2><button onclick="go('Estoque')">Ver estoque →</button></div>${items.filter(i=>status(i)!=='Normal').sort((a,b)=>a.qty/a.min-b.qty/b.min).map(i=>`<div class="alert"><div><span class="code">${
    esc(i.code)
  }
  </span><p>Qtd: <b>${
    i.qty
  }
  </b> / Mín: <b>${
    i.min
  }
  </b></p></div>${
    badge(i)
  }
  </div>`).join('')||'<div class="empty">Todos os itens estão acima do estoque mínimo.</div>'}</section>`
}
function stock(){
  return `<div class="toolbar"><input id="search" aria-label="Buscar pastilhas" placeholder="Busca por código ou descrição..." value="${esc(query)}"><div class="filters">${['Todos','Normal','Estoque Baixo','Crítico'].map(f=>`<button class="${filter===f?'selected':''}" onclick="filter='${f}';render()">${
    f
  }
  </button>`).join('')}</div><button class="primary" onclick="edit()">+ Nova Pastilha</button></div><div class="table-wrap"><table><thead><tr>${['CÓDIGO','DESCRIÇÃO','FABRICANTE','QTD','MÍNIMO','STATUS','AÇÕES'].map(x=>`<th>${
    x
  }
  </th>`).join('')}</tr></thead><tbody id="stockbody">${stockRows()}</tbody></table></div>`
}
function stockRows(){
  return items.filter(i=>(filter==='Todos'||status(i)===filter)&&`${i.code} ${i.description} ${i.maker}`.toLowerCase().includes(query.toLowerCase())).map(i=>`<tr><td><span class="code">${esc(i.code)}</span></td><td class="description" title="${esc(i.description)}">${esc(i.description)}<small>${esc(i.code.split(' ')[0])}</small></td><td>${esc(i.maker)}</td><td><strong class="${status(i)==='Crítico'?'danger':status(i)==='Estoque Baixo'?'low':''}">${i.qty}</strong></td><td>${i.min}</td><td>${badge(i)}</td><td><button class="table-action" onclick="edit(${i.id})">Editar</button><button class="table-action delete" onclick="removeItem(${i.id})">Excluir</button></td></tr>`).join('')||'<tr><td colspan="7" class="empty">Nenhuma pastilha encontrada.</td></tr>'
}
function selectedRecords(){
  return records.filter(r=>(reportItem==='all'||r.code===reportItem)&&(period==='all'||r.date===records[0]?.date))
}
function reports(){
  const rs=selectedRecords();
  return `<div class="report-toolbar"><select aria-label="Período" onchange="period=this.value;render()"><option value="all">Todo o período</option><option value="latest" ${period==='latest'?'selected':''}>Última data registrada</option></select><select aria-label="Item" onchange="reportItem=this.value;render()"><option value="all">Todos os itens</option>${[...new Set(records.map(r=>r.code))].map(c=>`<option ${
    reportItem===c?'selected':''
  }
  >${
    esc(c)
  }
  </option>`).join('')}</select><button onclick="exportCSV()">Exportar</button></div><div class="stats report-stats">${stat('TOTAL DE REGISTROS',rs.length)}${stat('ENTRADAS',rs.reduce((s,r)=>s+Math.max(0,r.delta),0),'success')}${stat('SAÍDAS',rs.reduce((s,r)=>s+Math.max(0,-r.delta),0),'danger')}</div><div class="table-wrap reports-table"><table><thead><tr>${['DATA','HORA','CÓDIGO','MATERIAL','TIPO','QTD','EST. ANTERIOR','EST. ATUAL','RESPONSÁVEL'].map(x=>`<th>${
    x
  }
  </th>`).join('')}</tr></thead><tbody>${rs.map(r=>`<tr><td>${
    r.date
  }
  </td><td>${
    r.time
  }
  </td><td><span class="code">${
    esc(r.code)
  }
  </span></td><td>Pastilha ${
    esc(r.code)
  }
  </td><td><span class="badge ${r.delta>0?'normal':''}">${
    r.delta>0?'↑ Entrada':'↓ Saída'
  }
  </span></td><td class="${r.delta>0?'success':'danger'}"><b>${
    r.delta>0?'+':''
  }
  ${
    r.delta
  }
  </b></td><td>${
    r.before
  }
  </td><td><strong>${
    r.before+r.delta
  }
  </strong></td><td>${
    esc(r.person)
  }
  </td></tr>`).join('')||'<tr><td colspan="9" class="empty">Nenhum registro encontrado.</td></tr>'}</tbody></table></div>`
}
function openModal(html){
  modal.innerHTML=html;
  modal.showModal()
}
const controls=`<div class="modal-actions"><button type="button" onclick="modal.close()">Cancelar</button><button class="primary">Salvar</button></div>`;
function edit(id){
  const i=items.find(x=>x.id===id);
  openModal(`<h2>${i?'Editar':'Nova'} pastilha</h2><form id="editform"><label for="code">Código</label><input id="code" name="code" required value="${esc(i?.code||'')}"><label for="desc">Descrição</label><input id="desc" name="description" required value="${esc(i?.description||'')}"><label for="maker">Fabricante</label><input id="maker" name="maker" required value="${esc(i?.maker||'')}"><label for="qty">Quantidade</label><input id="qty" name="qty" type="number" min="0" step="1" required value="${i?.qty||0}"><label for="min">Estoque mínimo</label><input id="min" name="min" type="number" min="1" step="1" required value="${i?.min||10}">${controls}</form>`);
  document.querySelector('#editform').onsubmit=e=>{
    e.preventDefault();
    const d=Object.fromEntries(new FormData(e.target));
    if(items.some(x=>x.code.toLowerCase()===d.code.trim().toLowerCase()&&x.id!==id)){
      toast('Este código já está cadastrado.');
      return
    }
    d.code=d.code.trim();
    d.qty=Number(d.qty);
    d.min=Number(d.min);
    if(i)Object.assign(i,d);
    else items.push({
      ...d,id:Date.now()
    }
    );
    modal.close();
    render();
    toast('Pastilha salva nesta demonstração.')
  }
}
function removeItem(id){
  const i=items.find(x=>x.id===id);
  openModal(`<h2>Excluir pastilha?</h2><p>Remover ${esc(i.code)} do estoque demonstrativo?</p><div class="modal-actions"><button onclick="modal.close()">Cancelar</button><button class="red" id="confirmdelete">Excluir</button></div>`);
  document.querySelector('#confirmdelete').onclick=()=>{
    items=items.filter(x=>x.id!==id);
    modal.close();
    render();
    toast('Pastilha excluída.')
  }
}
function movement(sign){
  openModal(`<h2>Registrar ${sign>0?'entrada':'saída'}</h2><form id="moveform"><label for="item">Pastilha</label><select id="item" name="item">${items.map(i=>`<option value="${i.id}">${
    esc(i.code)
  }
  — ${
    i.qty
  }
  em estoque</option>`).join('')}</select><label for="amount">Quantidade</label><input id="amount" name="amount" type="number" min="1" step="1" required value="1">${controls}</form>`);
  document.querySelector('#moveform').onsubmit=e=>{
    e.preventDefault();
    const d=new FormData(e.target),i=items.find(x=>x.id===Number(d.get('item'))),n=Number(d.get('amount'));
    if(!i)return;
    if(sign<0&&n>i.qty){
      toast('Quantidade maior que o estoque disponível.');
      return
    }
    const now=new Date();
    records.unshift({
      code:i.code,delta:sign*n,before:i.qty,date:now.toLocaleDateString('pt-BR'),time:now.toLocaleTimeString('pt-BR',{
        hour:'2-digit',minute:'2-digit'
      }
      ),person:'Bianca'
    }
    );
    i.qty+=sign*n;
    modal.close();
    render();
    toast('Movimentação registrada nesta demonstração.')
  }
}
function recover(){
  openModal(`<h2>Recuperar senha</h2><p>A recuperação de senha será conectada ao backend. Nesta demonstração, você pode entrar sem credenciais.</p><div class="modal-actions"><button class="primary" onclick="modal.close()">Entendi</button></div>`)
}
function exportCSV(){
  const rows=[['Data','Hora','Código','Tipo','Quantidade','Estoque anterior','Estoque atual','Responsável'],...selectedRecords().map(r=>[r.date,r.time,r.code,r.delta>0?'Entrada':'Saída',r.delta,r.before,r.before+r.delta,r.person])];
  const csv='\ufeff'+rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{
    type:'text/csv;charset=utf-8'
  }
  )),a=document.createElement('a');
  a.href=url;
  a.download='relatorio-inventech.csv';
  a.click();
  URL.revokeObjectURL(url);
  toast('Relatório exportado.')
}
render();
