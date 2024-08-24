import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class TemplatesController {
  public async index({ request, view, session }: HttpContext) {
    const gsId = request.param('gsId')

    //get details from session
    const details = session.get(gsId)

    const templateId = details['template']

    //get templates
    const templates = getTemplates()

    return view.render('pages/templates/index', { gsId, templateId, templates })
  }

  public async store({ request, session, response }: HttpContext) {
    const gsId = request.param('gsId')
    const templateId = request.input('templateId')

    const templates = getTemplates()
    const selectedTemplate = templates.find((template) => template.value === templateId)
    const price = selectedTemplate ? selectedTemplate.price : null

    // Put template in session
    let details = session.get(gsId)
    details = { ...details, templateId, price }

    session.put(gsId, details)

    return response.redirect().toRoute('templates.detail', { gsId })
  }

  public async detail({ request, view, session }: HttpContext) {
    const gsId = request.param('gsId')

    // Get detail from session
    const details = session.get(gsId)

    const messages = details.messages
    const files = details.files
    const videos = details.videos
    const audios = details.audios

    return view.render('pages/templates/detail', { gsId, messages, files, videos, audios })
  }

  public async storeDetail({ request, session, response }: HttpContext) {
    const gsId = request.param('gsId')

    const payload = request.except(['_csrf'])
    const messages = payload.messages

    // Handle files
    const files = request.files('files')
    if (files && files.length > 0) {
      const uploadPath = app.makePath(`uploads/${gsId}`)
      try {
        for (const file of files) {
          await file.move(uploadPath)
        }
      } catch (error) {
        console.error(error)
        return response.internalServerError('Failed to upload files')
      }
    }

    // Handle videos
    const videos = request.files('videos', {
      size: '20mb',
      extnames: ['mov', 'mp4', 'mkv'],
    })

    if (videos && videos.length > 0) {
      const uploadPath = app.makePath(`uploads/${gsId}`)
      try {
        for (const video of videos) {
          await video.move(uploadPath)
        }
      } catch (error) {
        console.error(error)
        return response.internalServerError('Failed to upload videos')
      }
    }

    const audios = request.files('audios')
    if (audios && audios.length > 0) {
      const uploadPath = app.makePath(`uploads/${gsId}`)
      try {
        for (const audio of audios) {
          await audio.move(uploadPath)
        }
      } catch (error) {
        console.error(error)
        return response.internalServerError('Failed to store audio')
      }
    }

    // Put details from session
    let details = session.get(gsId)

    details = { ...details, files, messages, videos, audios }
    session.put(gsId, details)

    return response.redirect().toRoute('checkout.index', { gsId })
  }
}

function getTemplates() {
  return [
    {
      img: '/images/template-6.jpg',
      video: '/videos/test.mp4',
      id: 'template1',
      placeholder: 'Template 1',
      label: 'template_1',
      value: 'Template 1',
      price: 2000.0,
    },
    {
      img: '/images/template-3.jpg',
      video: '/videos/test1.mp4',
      id: 'template2',
      placeholder: 'Template 2',
      label: 'template_2',
      value: 'Template 2',
      price: 1000.0,
    },
    {
      img: '/images/template-4.jpg',
      video: '/videos/test.mp4',
      id: 'template3',
      placeholder: 'Template 3',
      label: 'template_3',
      value: 'Template 3',
      price: 1250.0,
    },
    {
      img: '/images/template-8.jpg',
      video: '/videos/test1.mp4',
      id: 'template4',
      placeholder: 'Template 4',
      label: 'template_4',
      value: 'Template 4',
      price: 2500.0,
    },
    {
      img: '/images/template-10.jpg',
      video: '/videos/test.mp4',
      id: 'template5',
      placeholder: 'Template 5',
      label: 'template_5',
      value: 'Template 5',
      price: 5500.0,
    },
  ]
}
