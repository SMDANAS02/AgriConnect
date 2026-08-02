const { successResponse, errorResponse } = require('../utils/apiResponse');
const whatsappService = require('../services/whatsappService');

/**
 * @desc   Handle incoming WhatsApp media & text webhooks (Twilio, Meta, or UI Simulator)
 * @route  POST /api/whatsapp/webhook
 * @route  POST /api/whatsapp/simulate
 */
const handleWebhook = async (req, res, next) => {
  try {
    const payload = req.body || {};
    let imageUrl = null;
    let caption = '';
    let from = '+919876543210';
    let senderName = 'Tamil Nadu Farmer';

    // 1. Parse Twilio WhatsApp Webhook Format
    if (payload.MediaUrl0 || (payload.From && payload.From.toString().startsWith('whatsapp:'))) {
      imageUrl = payload.MediaUrl0 || null;
      caption = payload.Body || '';
      from = payload.From || from;
      senderName = payload.ProfileName || 'Farmer';
    } 
    // 2. Parse Meta WhatsApp Cloud API Webhook Format
    else if (payload.entry && Array.isArray(payload.entry)) {
      const changeValue = payload.entry[0]?.changes?.[0]?.value || {};
      const message = changeValue.messages?.[0] || {};
      const contact = changeValue.contacts?.[0] || {};

      from = message.from ? `+${message.from}` : from;
      senderName = contact.profile?.name || senderName;

      if (message.type === 'image' && message.image) {
        imageUrl = message.image.link || null;
        caption = message.image.caption || '';
      } else if (message.type === 'text') {
        caption = message.text?.body || '';
      }
    } 
    // 3. Parse Direct JSON / Frontend UI Simulator Payload
    else {
      imageUrl = payload.imageUrl || payload.mediaUrl || null;
      caption = payload.caption || payload.text || payload.message || '';
      from = payload.from || payload.senderPhone || from;
      senderName = payload.senderName || payload.name || senderName;
    }

    // Ensure at least an image or text query was received
    if (!imageUrl && !caption.trim()) {
      return errorResponse(res, 400, 'WhatsApp message must contain either a crop image photo or a text query caption.');
    }

    // Process disease detection and treatment knowledge base matching
    const diagnosisResult = await whatsappService.analyzeCropMedia({
      imageUrl,
      caption: caption.trim(),
      from,
      senderName
    });

    // Dispatch reply (via Twilio/Meta API or simulation logging)
    const replyResult = await whatsappService.sendWhatsAppReply({
      to: from,
      message: diagnosisResult.data.formattedReply
    });

    return successResponse(res, 200, 'WhatsApp crop diagnosis processed successfully', {
      sender: {
        name: senderName,
        phone: from
      },
      input: {
        imageUrl: diagnosisResult.data.imageUrl,
        caption: caption.trim()
      },
      diagnosis: {
        diseaseName: diagnosisResult.data.detectedDisease,
        confidenceScore: diagnosisResult.data.confidenceScore,
        cropName: diagnosisResult.data.cropName,
        symptoms: diagnosisResult.data.symptoms,
        recommendedTreatment: diagnosisResult.data.recommendedTreatment,
        preventiveMeasures: diagnosisResult.data.preventiveMeasures
      },
      whatsAppBotReply: diagnosisResult.data.formattedReply,
      outboundStatus: replyResult
    });

  } catch (error) {
    console.error('❌ [WhatsApp Webhook Controller Error]:', error.message);
    next(error);
  }
};

/**
 * @desc   Verify webhook subscription token for Meta WhatsApp Business API
 * @route  GET /api/whatsapp/webhook
 */
const verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const verifyToken = process.env.META_VERIFICATION_TOKEN || 'agriconnect_whatsapp_token';

  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('✅ Meta WhatsApp Webhook verified successfully.');
      return res.status(200).send(challenge);
    }
  }
  
  return res.status(403).json({
    success: false,
    message: 'Forbidden: Verification token mismatch.'
  });
};

module.exports = {
  handleWebhook,
  verifyWebhook
};
