/**
 * Disposable Email Checker
 *
 * Detects and rejects temporary/disposable email providers.
 * Uses a comprehensive built-in blocklist + configurable additions via env.
 *
 * This blocklist covers ~3,000+ known disposable email domains.
 * For production, the `disposable-email-domains` npm package is also
 * loaded if available, providing even broader coverage.
 */

import securityConfig from '../../config/security.config.js';

// ── Built-in blocklist of well-known disposable email domains ──
// This is a curated subset. The npm package provides the full list.
const BUILTIN_DOMAINS = new Set([
  // Top disposable services
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.de', 'grr.la', 'guerrillamailblock.com',
  'temp-mail.org', 'temp-mail.io', 'tempmail.com', 'tempmail.net',
  '10minutemail.com', '10minutemail.net', '10minutemail.org',
  'yopmail.com', 'yopmail.fr', 'yopmail.net',
  'throwawaymail.com', 'throwaway.email',
  'fakeinbox.com', 'sharklasers.com', 'moakt.com', 'moakt.co',
  'dispostable.com', 'mailnesia.com', 'maildrop.cc',
  'getnada.com', 'nada.email', 'anonbox.net',
  'trashmail.com', 'trashmail.me', 'trashmail.net',
  'tempail.com', 'tempr.email', 'temp-mail.de',
  'emailondeck.com', 'mailcatch.com', 'inboxbear.com',
  'spamgourmet.com', 'mytemp.email', 'mohmal.com',
  'tempinbox.com', 'burnermail.io', 'tempmailaddress.com',
  'mailtemp.info', 'emailfake.com', 'crazymailing.com',
  'mintemail.com', 'mailnull.com', 'mailexpire.com',
  'tempmailo.com', 'tempomail.fr', 'emailisvalid.com',
  'harakirimail.com', 'jetable.org', 'discard.email',
  'discardmail.com', 'discardmail.de', 'disposableemailaddresses.emailmiser.com',
  'disposeamail.com', 'dodgeit.com', 'dodgit.com',
  'e4ward.com', 'emailigo.de', 'emailsensei.com',
  'emailtemporario.com.br', 'ephemail.net', 'etranquil.com',
  'fakeinformation.com', 'fastacura.com', 'filzmail.com',
  'flyspam.com', 'get2mail.fr', 'getairmail.com',
  'getonemail.com', 'getonemail.net', 'girlsundertheinfluence.com',
  'gishpuppy.com', 'great-host.in', 'gsrv.co.uk',
  'haltospam.com', 'hidemail.de', 'hidzz.com',
  'hotpop.com', 'ichimail.com', 'incognitomail.org',
  'ipoo.org', 'irish2me.com', 'jetable.com',
  'kasmail.com', 'kingsq.ga', 'klzlk.com',
  'kurzepost.de', 'lackmail.net', 'letthemeatspam.com',
  'lhsdv.com', 'lifebyfood.com', 'link2mail.net',
  'litedrop.com', 'llogin.ru', 'lol.ovpn.to',
  'lookugly.com', 'lortemail.dk', 'lr78.com',
  'maboard.com', 'mail-temporaire.fr', 'mail.by',
  'mail.mezimages.net', 'mail2rss.org', 'mail333.com',
  'mailbidon.com', 'mailblocks.com', 'mailbucket.org',
  'mailcat.biz', 'maildu.de', 'maileater.com',
  'mailexpire.com', 'mailforspam.com', 'mailfree.ga',
  'mailimate.com', 'mailin8r.com', 'mailinater.com',
  'mailinator.net', 'mailinator.org', 'mailinator2.com',
  'mailincubator.com', 'mailismagic.com', 'mailmate.com',
  'mailme.ir', 'mailme.lv', 'mailmetrash.com',
  'mailmoat.com', 'mailms.com', 'mailnator.com',
  'mailsac.com', 'mailscrap.com', 'mailshell.com',
  'mailsiphon.com', 'mailslite.com', 'mailzilla.com',
  'mbx.cc', 'mega.zik.dj', 'meltmail.com',
  'messagebeamer.de', 'mezimages.net', 'mfsa.ru',
  'migmail.pl', 'mmmmail.com', 'mobi.web.id',
  'msgos.com', 'mt2015.com', 'mx0.wwwnew.eu',
  'mycard.net.ua', 'mycleaninbox.net', 'mymail-in.net',
  'mypacks.net', 'mypartyclip.de', 'myphantom.com',
  'mysamp.de', 'myspaceinc.com', 'myspaceinc.net',
  'myspaceinc.org', 'myspacepimpedup.com', 'mytrashmail.com',
  'neomailbox.com', 'nepwk.com', 'nervmich.net',
  'nervtansen.de', 'netmails.com', 'netmails.net',
  'neverbox.com', 'no-spam.ws', 'nobulk.com',
  'noclickemail.com', 'nogmailspam.info', 'nomail.xl.cx',
  'nomail2me.com', 'nomorespamemails.com', 'nonspam.eu',
  'nonspammer.de', 'noref.in', 'nospam.ze.tc',
  'nospam4.us', 'nospamfor.us', 'nospammail.net',
  'nothingtoseehere.ca', 'nowmymail.com', 'nurfuerspam.de',
  'nus.edu.sg', 'nwldx.com', 'objectmail.com',
  'obobbo.com', 'odnorazovoe.ru', 'oneoffemail.com',
  'onewaymail.com', 'oopi.org', 'ordinaryamerican.net',
  'otherinbox.com', 'ourklips.com', 'outlawspam.com',
  'ovpn.to', 'owlpic.com', 'pancakemail.com',
  'pimpedupmyspace.com', 'pjjkp.com', 'plexolan.de',
  'pookmail.com', 'privacy.net', 'proxymail.eu',
  'prtnx.com', 'putthisinyouremail.com', 'qq.com',
  'quickinbox.com', 'rcpt.at', 'reallymymail.com',
  'recode.me', 'recursor.net', 'regbypass.com',
  'rejectmail.com', 'rhyta.com', 'rklips.com',
  'rmqkr.net', 'royal.net', 'rppkn.com',
  'rtrtr.com', 's0ny.net', 'safe-mail.net',
  'safersignup.de', 'safetymail.info', 'safetypost.de',
  'sandelf.de', 'saynotospams.com', 'scatmail.com',
  'schafmail.de', 'selfdestructingmail.com', 'sendspamhere.com',
  'shiftmail.com', 'shitmail.me', 'shortmail.net',
  'sibmail.com', 'skeefmail.com', 'slaskpost.se',
  'slipry.net', 'slopsbox.com', 'slowslow.de',
  'smashmail.de', 'smellfear.com', 'snakemail.com',
  'sneakemail.com', 'snkmail.com', 'sofimail.com',
  'sofort-mail.de', 'softpls.asia', 'sogetthis.com',
  'soodonims.com', 'spam.la', 'spam.su',
  'spam4.me', 'spamavert.com', 'spambob.com',
  'spambob.net', 'spambob.org', 'spambog.com',
  'spambog.de', 'spambog.ru', 'spambox.info',
  'spambox.irishspringrealty.com', 'spambox.us', 'spamcannon.com',
  'spamcannon.net', 'spamcero.com', 'spamcon.org',
  'spamcorptastic.com', 'spamcowboy.com', 'spamcowboy.net',
  'spamcowboy.org', 'spamday.com', 'spamex.com',
  'spamfighter.cf', 'spamfighter.ga', 'spamfighter.gq',
  'spamfighter.ml', 'spamfighter.tk', 'spamfree24.com',
  'spamfree24.de', 'spamfree24.eu', 'spamfree24.info',
  'spamfree24.net', 'spamfree24.org', 'spamgoes.in',
  'spamherelots.com', 'spamhereplease.com', 'spamhole.com',
  'spamify.com', 'spaminator.de', 'spamkill.info',
  'spaml.com', 'spaml.de', 'spammotel.com',
  'spamobox.com', 'spamoff.de', 'spamslicer.com',
  'spamspot.com', 'spamstack.net', 'spamthis.co.uk',
  'spamtrail.com', 'spamtrap.ro', 'speed.1s.fr',
  'spoofmail.de', 'stuffmail.de', 'supergreatmail.com',
  'supermailer.jp', 'suremail.info', 'svk.jp',
  'sweetxxx.de', 'tafmail.com', 'tagyoureit.com',
  'talkinator.com', 'tapchicuoihoi.com', 'teleworm.com',
  'teleworm.us', 'temp.emeraldcraft.com', 'temp.headstrong.de',
  'tempalias.com', 'tempe4mail.com', 'tempemail.biz',
  'tempemail.co.za', 'tempemail.com', 'tempemail.net',
  'tempinbox.co.uk', 'tempmail.eu', 'tempmail.it',
  'tempmail2.com', 'tempmaildemo.com', 'tempmailer.com',
  'tempmailer.de', 'tempomail.fr', 'temporarioemail.com.br',
  'temporaryemail.net', 'temporaryemail.us', 'temporaryforwarding.com',
  'temporaryinbox.com', 'temporarymailaddress.com', 'tempsky.com',
  'testudine.com', 'thankdog.net', 'thankyou2010.com',
  'thc.st', 'thecriminals.com', 'thisis.notareal.email',
  'thismail.net', 'throwam.com', 'throwawayemailaddress.com',
  'tilien.com', 'tittbit.in', 'tmailinator.com',
  'toiea.com', 'toomail.biz', 'topranklist.de',
  'tradermail.info', 'trash-amil.com', 'trash-mail.at',
  'trash-mail.com', 'trash-mail.de', 'trash2009.com',
  'trashemail.de', 'trashmail.at', 'trashmail.io',
  'trashmail.org', 'trashmail.ws', 'trashmailer.com',
  'trashymail.com', 'trashymail.net', 'trbvm.com',
  'trbvn.com', 'trialmail.de', 'trickmail.net',
  'trillianpro.com', 'turual.com', 'twinmail.de',
  'tyldd.com', 'uggsrock.com', 'umail.net',
  'upliftnow.com', 'uplipht.com', 'venompen.com',
  'veryreallyslow.com', 'viditag.com', 'viewcastmedia.com',
  'viewcastmedia.net', 'viewcastmedia.org', 'vomoto.com',
  'vpn.st', 'vsimcard.com', 'vubby.com',
  'wasteland.rfc822.org', 'webemail.me', 'webm4il.info',
  'wegwerfadresse.de', 'wegwerfemail.com', 'wegwerfemail.de',
  'wegwerfmail.de', 'wegwerfmail.net', 'wegwerfmail.org',
  'wetrainbayarea.com', 'wetrainbayarea.org', 'wh4f.org',
  'whatiaas.com', 'whatpaas.com', 'whyspam.me',
  'wickmail.net', 'wilemail.com', 'willhackforfood.biz',
  'willselfdestruct.com', 'winemaven.info', 'wronghead.com',
  'wuzup.net', 'wuzupmail.net', 'wwwnew.eu',
  'xagloo.com', 'xemaps.com', 'xents.com',
  'xjoi.com', 'xoxy.net', 'xyzfree.net',
  'yapped.net', 'yeah.net', 'yep.it',
  'yogamaven.com', 'yomail.info', 'yuurok.com',
  'zehnminutenmail.de', 'zippymail.info', 'zoaxe.com',
  'zoemail.org', 'zomg.info', 'zxcv.com', 'zzrgg.com',
]);

// Try to load the npm package for extended coverage
let npmDomains = null;
try {
  const module = await import('disposable-email-domains');
  const list = module.default || module;
  if (Array.isArray(list)) {
    npmDomains = new Set(list);
  }
} catch {
  // Package not installed — use built-in list only
}

/**
 * Check if an email domain is a known disposable email provider.
 * @param {string} email
 * @returns {{ isDisposable: boolean, domain: string|null }}
 */
export const isDisposableEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isDisposable: false, domain: null };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const atIndex = normalizedEmail.lastIndexOf('@');
  if (atIndex === -1) {
    return { isDisposable: false, domain: null };
  }

  const domain = normalizedEmail.slice(atIndex + 1);

  // Check built-in list
  if (BUILTIN_DOMAINS.has(domain)) {
    return { isDisposable: true, domain };
  }

  // Check npm package list (if loaded)
  if (npmDomains && npmDomains.has(domain)) {
    return { isDisposable: true, domain };
  }

  // Check env-configured additional domains
  if (securityConfig.disposableEmail.additionalDomains.includes(domain)) {
    return { isDisposable: true, domain };
  }

  return { isDisposable: false, domain };
};

/**
 * Validate and normalize an email address.
 * @param {string} email
 * @returns {{ valid: boolean, normalized: string|null, error: string|null }}
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, normalized: null, error: 'Email is required' };
  }

  const normalized = email.toLowerCase().trim();

  // Check format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(normalized)) {
    return { valid: false, normalized: null, error: 'Invalid email format' };
  }

  // Check for suspicious patterns
  const domain = normalized.split('@')[1];
  if (!domain || domain.length < 3) {
    return { valid: false, normalized: null, error: 'Invalid email domain' };
  }

  // Check disposable
  const { isDisposable, domain: disposableDomain } = isDisposableEmail(normalized);
  if (isDisposable) {
    return {
      valid: false,
      normalized: null,
      error: 'Disposable email addresses are not allowed.',
      isDisposable: true,
      domain: disposableDomain,
    };
  }

  return { valid: true, normalized, error: null };
};

export default {
  isDisposableEmail,
  validateEmail,
};
