import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import GiftTemplate from '#models/gift_template'
import GiftTemplateCategory from '#models/gift_template_category'
import GiftTemplateAudio from '#models/gift_template_audio'
import GiftTemplateMessage from '#models/gift_template_message'
import GiftTemplateVideo from '#models/gift_template_video'
import S3Service from '#services/aws'

export default class TemplatesController {
  public async index({ request, view, session }: HttpContext) {
    const gsId = request.param('gsId')

    //get details from session
    const details = session.get(gsId)
    const templateId = details['template']

    const giftTemplateCategories = await GiftTemplateCategory.all()

    // Get categorized templates
    const categoriesWithTemplates = await Promise.all(
      giftTemplateCategories.map(async (category) => {
        // get active template
        const activeTemplate = await GiftTemplate.query()
          .where('category_id', category.id)
          .whereNull('deletedAt')
          .exec()

        // get templates with puclic url
        const giftTemplatesWithUrls = await Promise.all(
          activeTemplate.map(async (template) => {
            const filePath = template.thumbnail
            const publicUrl = filePath ? await S3Service.getPublicUrl(filePath) : null

            return {
              ...template.toJSON(),
              publicUrl,
            }
          })
        )

        return {
          ...category.toJSON(),
          templates: giftTemplatesWithUrls,
        }
      })
    )

    return view.render('pages/templates/index', {
      gsId,
      details,
      templateId,
      giftTemplates: categoriesWithTemplates,
    })
  }

  public async store({ request, session, response }: HttpContext) {
    try {
    } catch (error) {}
    const gsId = request.param('gsId')
    const templateId = request.input('templateId')

    // get selected template
    const template = await GiftTemplate.find(templateId)
    const templateName = template?.name

    // find selected template category
    const categoryId = template?.category_id
    const category = await GiftTemplateCategory.find(categoryId)
    const categoryName = category?.name

    // Put template in session
    let details = session.get(gsId)
    details = { ...details, templateId, templateName, categoryName }

    session.put(gsId, details)

    return response.redirect().toRoute('templates.detail', { gsId })
  }

  public async detail({ request, view, session }: HttpContext) {
    const gsId = request.param('gsId')

    // Get detail from session
    const details = session.get(gsId)
    const templateId = details.templateId

    const messages = details.messages
    const files = details.files
    const images = details.images
    const videos = details.videos
    const audios = details.audios

    // get details of message associated with template
    const templateMessage = await GiftTemplateMessage.query().withScopes((scopes) =>
      scopes.ofMessage(templateId)
    )
    const simplyfyMessage = templateMessage.map((message) => ({
      ...message.toJSON(),
    }))

    // get details of audio associated with template
    const templateAudio = await GiftTemplateAudio.query().withScopes((scopes) =>
      scopes.ofAudio(templateId)
    )
    // add index field in audio for component naming
    const templateAudioWithIndex = templateAudio.map((audio, index) => ({
      ...audio.toJSON(),
      index,
    }))

    // get details of video associated with template
    const templateVideo = await GiftTemplateVideo.query().withScopes((scopes) =>
      scopes.ofVideo(templateId)
    )
    // add index field in video for component naming
    const templateVideoWithIndex = templateVideo.map((video, index) => ({
      ...video.toJSON(),
      index,
    }))

    const template = await GiftTemplate.find(templateId)

    return view.render('pages/templates/detail', {
      gsId,
      messages,
      files,
      images,
      videos,
      audios,
      template,
      templateMessage: simplyfyMessage,
      templateAudio: templateAudioWithIndex,
      templateVideo: templateVideoWithIndex,
    })
  }

  public async storeDetail({ request, session, response }: HttpContext) {
    const gsId = request.param('gsId')
    let details = session.get(gsId)

    const payload = request.except(['_csrf'])
    const messages = payload.messages

    // create path to store user uploaded file
    const uploadPath = app.makePath(`uploads/${gsId}`)

    // Handle files
    const files = request.files('files')
    if (files.length > 0) {
      await Promise.all(files.map((file) => file.move(uploadPath)))
    }

    // Handle images
    const images = request.files('images', {
      size: '20mb',
      extnames: ['jpeg', 'jpg', 'png', 'webp'],
    })
    if (images.length > 0) {
      await Promise.all(images.map((image) => image.move(uploadPath)))
    }

    // Handle videos
    const templateVideo = await GiftTemplateVideo.query().withScopes((scopes) =>
      scopes.ofVideo(details.templateId)
    )
    const templateVideoWithIndex = templateVideo.map((video, index) => ({
      ...video.toJSON(),
      index,
    }))

    const videos: any[] = []
    for (let i = 0; i < templateVideoWithIndex.length; i++) {
      const fieldName = `videos-${i}`
      const uploadedVideos = request.files(fieldName, {
        size: '20mb',
        extnames: ['mov', 'mp4', 'mkv'],
      })

      if (uploadedVideos.length > 0) {
        await Promise.all(uploadedVideos.map((video) => video.move(uploadPath)))
      }
      videos.push(...uploadedVideos)
    }

    // Handle audios
    const templateAudio = await GiftTemplateAudio.query().withScopes((scopes) =>
      scopes.ofAudio(details.templateId)
    )
    const templateAudioWithIndex = templateAudio.map((audio, index) => ({
      ...audio.toJSON(),
      index,
    }))

    const audios: any[] = []
    for (let i = 0; i < templateAudioWithIndex.length; i++) {
      const fieldName = `audios-${i}`
      const uploadedAudios = request.files(fieldName)
      if (uploadedAudios.length > 0) {
        await Promise.all(uploadedAudios.map((audio) => audio.move(uploadPath)))
      }
      audios.push(...uploadedAudios)
    }

    // Put details from session
    details = { ...details, files, messages, images, videos, audios }
    session.put(gsId, details)

    return response.redirect().toRoute('checkout.index', { gsId })
  }
}
