import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import GiftTemplate from '#models/gift_template'
import GiftTemplateCategory from '#models/gift_template_category'
import GiftTemplateAudio from '#models/gift_template_audio'
import GiftTemplateMessage from '#models/gift_template_message'
import GiftTemplateVideo from '#models/gift_template_video'
import S3Service from '#services/aws'
import GiftAudioRecording from '#models/gift_audio_recording'
import GiftVideoMessage from '#models/gift_video_message'
import GiftTextMessage from '#models/gift_text_message'

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
    const template = await GiftTemplate.find(templateId)

    const messages = details.messages
    const files = details.files
    const images = details.images
    const videos = details.videos
    const audios = details.audios

    const [templateMessages, templateAudios, templateVideos] = await Promise.all([
      GiftTemplateMessage.query()
        .withScopes((scopes) => scopes.ofMessage(templateId))
        .exec(),
      GiftTemplateAudio.query()
        .withScopes((scopes) => scopes.ofAudio(templateId))
        .exec(),
      GiftTemplateVideo.query()
        .withScopes((scopes) => scopes.ofVideo(templateId))
        .exec(),
    ])
    const messageIds = Array.from(
      new Set(templateMessages.map((message) => message.text_message_id))
    )
    const [textMessages, audioRecordings, videoMessages] = await Promise.all([
      GiftTextMessage.query().whereIn('id', messageIds).exec(),
      GiftAudioRecording.query()
        .whereIn('id', Array.from(new Set(templateAudios.map((audio) => audio.audio_id))))
        .exec(),
      GiftVideoMessage.query()
        .whereIn('id', Array.from(new Set(templateVideos.map((video) => video.video_id))))
        .exec(),
    ])

    const messagesMap = new Map(textMessages.map((message) => [message.id, message]))
    const audioMap = new Map(audioRecordings.map((recording) => [recording.id, recording]))
    const videoMap = new Map(videoMessages.map((video) => [video.id, video]))

    const enhancedMessageData = templateMessages.map((message) => ({
      ...message.toJSON(),
      code: messagesMap.get(message.text_message_id)?.code ?? null,
      title: messagesMap.get(message.text_message_id)?.title ?? null,
    }))

    const enhancedAudioData = templateAudios.map((audio, index) => ({
      ...audio.toJSON(),
      index,
      code: audioMap.get(audio.audio_id)?.code ?? null,
      title: audioMap.get(audio.audio_id)?.title ?? null,
    }))

    const enhancedVideoData = templateVideos.map((video, index) => ({
      ...video.toJSON(),
      index,
      code: videoMap.get(video.video_id)?.code ?? null,
      title: videoMap.get(video.video_id)?.title ?? null,
    }))

    return view.render('pages/templates/detail', {
      gsId,
      messages,
      files,
      images,
      videos,
      audios,
      template,
      templateMessage: enhancedMessageData,
      templateAudio: enhancedAudioData,
      templateVideo: enhancedVideoData,
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
      await Promise.all(
        files.map(async (file) => {
          try {
            await file.move(uploadPath)

            console.log(`File successfully moved to ${uploadPath}/${file.clientName}`)
          } catch (error) {
            console.error('Error moving file', error)
          }
        })
      )
    }

    // Handle images
    const images = request.files('images', {
      size: '20mb',
      extnames: ['jpeg', 'jpg', 'png', 'webp'],
    })
    if (images.length > 0) {
      await Promise.all(
        images.map(async (image) => {
          try {
            await image.move(uploadPath)

            console.log(`Image successfully moved to ${uploadPath}/${image.clientName}`)
          } catch (error) {
            console.error('Error moving image', error)
          }
        })
      )
    }

    // Handle videos
    const templateVideo = await GiftTemplateVideo.query().withScopes((scopes) =>
      scopes.ofVideo(details.templateId)
    )
    const templateVideoWithIndex = templateVideo.map((video, index) => ({
      ...video.toJSON(),
      index,
    }))

    const videoIds = templateVideoWithIndex.map((video: any) => video.videoId)
    const videoMessages = await GiftVideoMessage.query()
      .select('id', 'code')
      .whereIn('id', videoIds)
      .exec()

    const videoCodesMap = new Map(videoMessages.map((video) => [video.id, video.code]))

    const enhancedVideoData = templateVideoWithIndex.map((video: any) => {
      const code = videoCodesMap.get(video.videoId)

      return {
        ...video,
        code,
      }
    })

    const videoCodes = new Map(enhancedVideoData.map((video) => [video.index, video.code]))
    const videos: any[] = []
    for (let i = 0; i < templateVideoWithIndex.length; i++) {
      const fieldName = `videos-${i}`
      const uploadedVideos = request.files(fieldName, {
        size: '20mb',
        extnames: ['mov', 'mp4', 'mkv'],
      })

      if (uploadedVideos.length > 0) {
        await Promise.all(
          uploadedVideos.map(async (video) => {
            try {
              const code = videoCodes.get(i)
              const fileExtension = video.extname
              const newFileName = `${code}.${fileExtension}`

              await video.move(uploadPath, {
                name: newFileName,
              })
              console.log(`Video successfully moved to ${uploadPath}/${newFileName}`)
            } catch (error) {
              console.error(`Error moving video: ${error.message}`)
            }
          })
        )
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

    const audioIds = templateAudioWithIndex.map((audio: any) => audio.audioId)
    const audioMessages = await GiftAudioRecording.query()
      .select('id', 'code')
      .whereIn('id', audioIds)
      .exec()

    const audioCodesMap = new Map(audioMessages.map((audio) => [audio.id, audio.code]))
    const enhancedAudioData = templateAudioWithIndex.map((audio: any) => {
      const code = audioCodesMap.get(audio.audioId)

      return {
        ...audio,
        code,
      }
    })

    const audioCodes = new Map(enhancedAudioData.map((audio) => [audio.index, audio.code]))
    const audios: any[] = []
    for (let i = 0; i < templateAudioWithIndex.length; i++) {
      const fieldName = `audios-${i}`
      const uploadedAudios = request.files(fieldName)
      if (uploadedAudios.length > 0) {
        await Promise.all(
          uploadedAudios.map(async (audio) => {
            try {
              // Generate a unique file name
              const code = audioCodes.get(i)
              const fileExtension = audio.extname
              const newFileName = `${code}.${fileExtension}`

              // Attempt to move the file
              await audio.move(uploadPath, {
                name: newFileName,
              })
              console.log(`audio successfully moved to ${uploadPath}/${newFileName}`)
            } catch (error) {
              console.error(`Error moving audio: ${error.message}`)
            }
          })
        )
      }
      audios.push(...uploadedAudios)
    }

    // Put details from session
    details = { ...details, files, messages, images, videos, audios }
    session.put(gsId, details)

    return response.redirect().toRoute('checkout.index', { gsId })
  }
}
