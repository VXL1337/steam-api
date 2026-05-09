function clean(html) {

  if (!html) return null;

  return html
    .replace(/<[^>]*>/g, '\n')
    .replace(/\n+/g, '\n')
    .replace(/\t/g, '')
    .trim();
}

export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');

  try {

    const id = req.query.id;

    if (!id) {
      return res.status(400).json({
        error: 'id é obrigatório'
      });
    }

    const response = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${id}&l=brazilian&cc=BR`
    );

    const data = await response.json();

    const game = data[id]?.data;

    if (!game) {
      return res.status(404).json({
        error: 'Jogo não encontrado'
      });
    }

    res.setHeader(
      'Cache-Control',
      's-maxage=86400'
    );

    res.status(200).json({

      // BASICO
      steam_appid: game.steam_appid,
      type: game.type,
      name: game.name,
      required_age: game.required_age,
      is_free: game.is_free,

      // DESCRIÇÕES
      description: game.short_description,
      short_description: game.short_description,
      detailed_description:
        clean(game.detailed_description),
      about_the_game:
        clean(game.about_the_game),

      // IMAGENS
      banner: game.header_image,
      header_image: game.header_image,
      capsule_image: game.capsule_image,
      capsule_imagev5: game.capsule_imagev5,
      background: game.background,
      background_raw: game.background_raw,

      // SCREENSHOTS
      screenshots: game.screenshots?.map(s => ({
        id: s.id,
        thumbnail: s.path_thumbnail,
        full: s.path_full
      })) || [],

      // TRAILERS
      movies: game.movies?.map(m => ({
        id: m.id,
        name: m.name,
        thumbnail: m.thumbnail,
        mp4: m.mp4,
        webm: m.webm,
        highlight: m.highlight
      })) || [],

      // GENEROS
      genres:
        game.genres?.map(g => g.description) || [],

      genres_full:
        game.genres || [],

      // CATEGORIAS
      categories:
        game.categories || [],

      // PREÇO
      price: game.price_overview?.final_formatted,
      discount:
        game.price_overview?.discount_percent,

      price_original:
        game.price_overview?.initial_formatted,

      price_full:
        game.price_overview || null,

      // DATA
      release_date:
        game.release_date || null,

      // EMPRESAS
      developers:
        game.developers || [],

      publishers:
        game.publishers || [],

      // DLC
      dlc:
        game.dlc || [],

      // IDIOMAS
      supported_languages:
        clean(game.supported_languages),

      supported_languages_raw:
        game.supported_languages,

      // METACRITIC
      metacritic:
        game.metacritic || null,

      // RECOMENDAÇÕES
      recommendations:
        game.recommendations || null,

      // CONQUISTAS
      achievements:
        game.achievements || null,

      // CONTROLE
      controller_support:
        game.controller_support || null,

      // SITE
      website:
        game.website || null,

      // SUPORTE
      support_info:
        game.support_info || null,

      // REQUISITOS PC
      pc_requirements: {

        minimum_raw:
          game.pc_requirements?.minimum || null,

        recommended_raw:
          game.pc_requirements?.recommended || null,

        minimum:
          clean(game.pc_requirements?.minimum),

        recommended:
          clean(game.pc_requirements?.recommended)
      },

      // REQUISITOS MAC
      mac_requirements: {

        minimum_raw:
          game.mac_requirements?.minimum || null,

        recommended_raw:
          game.mac_requirements?.recommended || null,

        minimum:
          clean(game.mac_requirements?.minimum),

        recommended:
          clean(game.mac_requirements?.recommended)
      },

      // REQUISITOS LINUX
      linux_requirements: {

        minimum_raw:
          game.linux_requirements?.minimum || null,

        recommended_raw:
          game.linux_requirements?.recommended || null,

        minimum:
          clean(game.linux_requirements?.minimum),

        recommended:
          clean(game.linux_requirements?.recommended)
      },

      // LEGAL
      legal_notice:
        clean(game.legal_notice),

      // NOTAS
      notes:
        clean(game.notes),

      // DRM
      drm_notice:
        clean(game.drm_notice),

      // AVISOS
      ext_user_account_notice:
        clean(game.ext_user_account_notice),

      // PACOTES
      packages:
        game.packages || [],

      package_groups:
        game.package_groups || [],

      // CONTENT DESCRIPTORS
      content_descriptors:
        game.content_descriptors || null

    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

}
