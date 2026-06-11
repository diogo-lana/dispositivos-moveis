// Tipo retornado pela API (GET /produtos e GET /produtos/{id})
export type prodType = {
  cd_produto: number       // ID numérico vindo da API
  desc_produto: string     // nome do produto
  cd_categoria: number
  nm_categoria?: string    // disponível no endpoint de detalhe
  cd_fabricante: number
  nm_fabricante?: string   // disponível no endpoint de detalhe
}

// Tipo para criar/editar um produto (POST /produtos e PUT /produtos/{id})
export type prodCreateType = {
  desc_produto: string
  cd_categoria: number
  cd_fabricante: number
}
