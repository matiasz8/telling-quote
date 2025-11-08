export interface ProcessedText {
  id: number;
  title: string;
  subtitle: string | null;
  sentence: string;
  isSubtitleIntro?: boolean; // Marca si esta oración es la introducción del subtítulo
  isBulletPoint?: boolean; // Marca si es un punto de lista
  bulletHistory?: string[]; // Histórico de bullets anteriores en esta lista
  isNumberedList?: boolean; // Marca si es una lista numerada
  indentLevel?: number; // Nivel de indentación (0 = raíz, 1 = sub-bullet, etc.)
  parentBullet?: string; // El bullet padre si es un sub-bullet
  parentIsNumbered?: boolean; // Si el padre es una lista numerada
  parentNumberIndex?: number; // El índice numérico del padre si es una lista numerada
}

interface Section {
  subtitle: string | null;
  content: string;
}

/**
 * Processes raw article content into a list of sentences,
 * each associated with the main article title and current subtitle.
 * @param title - The main title of the reading.
 * @param content - The raw text content (all paragraphs).
 */
export function processContent(title: string, content: string): ProcessedText[] {
  // Split content into lines
  const lines = content.split('\n');
  const sections: Section[] = [];
  let currentSubtitle: string | null = null;
  let currentContent: string[] = [];

  // Process lines to identify sections with subtitles
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check if line is a markdown heading (##, ###, etc.)
    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);

    // Check if line is a numbered or bulleted list (to exclude from heading detection)
    const isNumberedList = /^\d+\.\s+/.test(trimmedLine);
    const isBulletList = /^[-*+]\s+/.test(trimmedLine);

    // Heuristic: heading-like line (no markdown) - short, surrounded by blank lines, no terminal punctuation
    const prevIsBlank = i === 0 || lines[i - 1].trim().length === 0;
    const nextIsBlank = i === lines.length - 1 || lines[i + 1].trim().length === 0;
    const endsWithSentencePunct = /[.!?؛؟]$/.test(trimmedLine);
    const isReasonableLength = trimmedLine.length > 0 && trimmedLine.length <= 120;
    const words = trimmedLine.split(/\s+/);
    const titleCaseRatio = words.length > 0
      ? words.filter((w) => /^(?:[A-ZÁÉÍÓÚÜÑ¿¡]|\d)/.test(w)).length / words.length
      : 0;
    const startsWithInverted = /^[¿¡]/.test(trimmedLine);
    const endsWithQuestionOrExclaim = /[?¿!¡]$/.test(trimmedLine);
    const looksLikeHeading =
      !headingMatch &&
      !isNumberedList &&
      !isBulletList &&
      prevIsBlank &&
      nextIsBlank &&
      isReasonableLength &&
      (titleCaseRatio >= 0.4 || startsWithInverted) &&
      (!endsWithSentencePunct || endsWithQuestionOrExclaim);

    if (headingMatch || looksLikeHeading) {
      // Save previous section if it has content
      if (currentContent.length > 0) {
        sections.push({
          subtitle: currentSubtitle,
          content: currentContent.join('\n'),
        });
        currentContent = [];
      }

      // Extract subtitle text (remove # and trim)
      const rawSubtitle = headingMatch ? headingMatch[2] : trimmedLine;
      currentSubtitle = rawSubtitle
        .replace(/^#{1,6}\s+/, '')
        .replace(/\*\*/g, '') // Remove bold markers
        .replace(/\*/g, '') // Remove italic markers
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links, keep text
        .trim();
    } else if (trimmedLine.length > 0) {
      // Regular content line
      currentContent.push(line);
    } else if (trimmedLine.length === 0 && currentContent.length > 0) {
      // Empty line - keep it for paragraph separation
      currentContent.push('');
    }
  }

  // Add the last section
  if (currentContent.length > 0) {
    sections.push({
      subtitle: currentSubtitle,
      content: currentContent.join('\n'),
    });
  }

  // Process each section into sentences
  const processedText: ProcessedText[] = [];
  let globalIndex = 0;

  for (const section of sections) {
    // Add subtitle introduction slide if there's a subtitle
    if (section.subtitle) {
      processedText.push({
        id: globalIndex++,
        title: title,
        subtitle: null, // No subtitle shown in the header yet
        sentence: section.subtitle,
        isSubtitleIntro: true, // Mark this as the subtitle intro
      });
    }

    const sectionLines = section.content.split('\n');
    let currentParagraph: string[] = [];
    const bulletHistoryByLevel: Record<number, string[]> = {}; // Historial separado por nivel
    let lastParentBullet: string | null = null; // Guarda el último bullet de nivel 0
    let parentIsNumbered = false; // Indica si el padre es una lista numerada
    let parentNumberIndex = 0; // Índice del número del padre
    let lastIndentLevel = 0; // Trackea el último nivel de indentación procesado

    for (const line of sectionLines) {
      const trimmedLine = line.trim();
      
      // Detectar nivel de indentación (contar espacios/tabs al inicio)
      const indentMatch = line.match(/^(\s*)/);
      const indentLevel = indentMatch ? Math.floor(indentMatch[1].length / 2) : 0; // Cada 2 espacios = 1 nivel

      // Skip empty lines and horizontal rules (---, ****, ___, etc.)
      if (trimmedLine.length === 0 || /^[-*_]{3,}$/.test(trimmedLine)) {
        // Process accumulated paragraph if there's content
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.join(' ').trim();
          if (paragraphText.length > 0) {
            // Remove markdown formatting
            const cleanText = paragraphText
              .replace(/\*\*/g, '')
              .replace(/\*/g, '')
              .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
            
            // Split into sentences
            const sentences = cleanText.match(/[^.!?]+[.!?]/g) || [];
            if (sentences.length > 0) {
              for (const sentence of sentences) {
                const trimmedSentence = sentence.trim();
                if (trimmedSentence.length > 0) {
                  processedText.push({
                    id: globalIndex++,
                    title: title,
                    subtitle: section.subtitle,
                    sentence: trimmedSentence,
                  });
                }
              }
            } else if (cleanText.length > 0) {
              processedText.push({
                id: globalIndex++,
                title: title,
                subtitle: section.subtitle,
                sentence: cleanText,
              });
            }
          }
          currentParagraph = [];
        }
        // Solo reset si la línea NO tiene espacios de indentación (realmente vacía)
        // Si tiene espacios, puede ser parte de una lista indentada
        if (line.trim().length === 0 && line.length === 0) {
          // Limpiar todos los historiales cuando hay línea completamente vacía
          Object.keys(bulletHistoryByLevel).forEach(level => {
            delete bulletHistoryByLevel[parseInt(level)];
          });
          parentIsNumbered = false; // Reset al terminar una lista
          parentNumberIndex = 0; // Reset índice
        }
        continue; // Skip this line
      }

      // Check if line is a bullet point or numbered list
      const bulletMatch = trimmedLine.match(/^[-*+]\s+(.+)$/);
      const numberedMatch = bulletMatch ? null : trimmedLine.match(/^\d+\.\s+(.+)$/);
      // Heuristic bullet: "Label: description" style
      const colonBulletMatch = bulletMatch || numberedMatch ? null : trimmedLine.match(/^(?=.{3,120}$)([A-ZÁÉÍÓÚÜÑ¿¡][^:]{1,80}):\s+(.+)$/);

      if (bulletMatch || numberedMatch) {
        // Process accumulated paragraph first
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.join(' ').trim();
          if (paragraphText.length > 0) {
            // Remove markdown formatting
            const cleanText = paragraphText
              .replace(/\*\*/g, '')
              .replace(/\*/g, '')
              .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
            
            // Split into sentences
            const sentences = cleanText.match(/[^.!?]+[.!?]/g) || [];
            if (sentences.length > 0) {
              for (const sentence of sentences) {
                const trimmedSentence = sentence.trim();
                if (trimmedSentence.length > 0) {
                  processedText.push({
                    id: globalIndex++,
                    title: title,
                    subtitle: section.subtitle,
                    sentence: trimmedSentence,
                  });
                }
              }
            } else if (cleanText.length > 0) {
              processedText.push({
                id: globalIndex++,
                title: title,
                subtitle: section.subtitle,
                sentence: cleanText,
              });
            }
            currentParagraph = [];
          }
          // NO resetear parentIsNumbered ni parentNumberIndex aquí - solo cuando termina la lista completa
        }
        
        // Process bullet point or numbered item and add to history
        const match = bulletMatch || numberedMatch;
        let bulletText = match![1].trim();
        // Remove markdown formatting
        bulletText = bulletText
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
        
        if (bulletText.length > 0) {
          // Inicializar historial del nivel si no existe
          if (!bulletHistoryByLevel[indentLevel]) {
            bulletHistoryByLevel[indentLevel] = [];
          }
          
          // Si cambia el nivel de indentación, limpiar niveles superiores
          if (indentLevel !== lastIndentLevel) {
            // Limpiar historiales de niveles mayores que el actual
            Object.keys(bulletHistoryByLevel).forEach(level => {
              if (parseInt(level) > indentLevel) {
                delete bulletHistoryByLevel[parseInt(level)];
              }
            });
            lastIndentLevel = indentLevel;
          }
          
          // Guardar el bullet padre si es de nivel 0
          if (indentLevel === 0) {
            lastParentBullet = bulletText;
            parentIsNumbered = !!numberedMatch; // Rastrear si el padre es numerado
            // Extraer el índice numérico si es numerado
            if (numberedMatch) {
              const numberMatch = trimmedLine.match(/^(\d+)\./);
              parentNumberIndex = numberMatch ? parseInt(numberMatch[1], 10) : 0;
            } else {
              parentNumberIndex = 0; // Reset si no es numerado
            }
          }
          
          // Add current bullet to history of this level
          bulletHistoryByLevel[indentLevel].push(bulletText);
          
          // Create a slide with all bullets accumulated so far
          const slide = {
            id: globalIndex++,
            title: title,
            subtitle: section.subtitle,
            sentence: bulletText, // El bullet actual
            isBulletPoint: true,
            isNumberedList: !!numberedMatch, // Marca si es lista numerada
            bulletHistory: [...(bulletHistoryByLevel[indentLevel] || []).slice(0, -1)], // Todos los bullets anteriores del mismo nivel
            indentLevel: indentLevel,
            parentBullet: indentLevel > 0 && lastParentBullet ? lastParentBullet : undefined,
            parentIsNumbered: indentLevel > 0 && lastParentBullet ? parentIsNumbered : undefined, // Si tiene padre, usar su tipo
            parentNumberIndex: indentLevel > 0 && lastParentBullet && parentIsNumbered ? parentNumberIndex : undefined,
          };
          
          processedText.push(slide);
        }
      } else if (colonBulletMatch) {
        // Treat label: description as a bullet item
        const bulletText = `${colonBulletMatch[1].trim()}: ${colonBulletMatch[2].trim()}`
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

        // Flush paragraph before adding bullet
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.join(' ').trim();
          if (paragraphText.length > 0) {
            const sentences = paragraphText.match(/[^.!?]+[.!?]/g) || [];
            if (sentences.length > 0) {
              for (const sentence of sentences) {
                const trimmedSentence = sentence.trim();
                if (trimmedSentence.length > 0) {
                  processedText.push({
                    id: globalIndex++,
                    title: title,
                    subtitle: section.subtitle,
                    sentence: trimmedSentence,
                  });
                }
              }
            } else {
              processedText.push({
                id: globalIndex++,
                title: title,
                subtitle: section.subtitle,
                sentence: paragraphText,
              });
            }
          }
          currentParagraph = [];
          // Reset bullet history when starting a new bullet list (colon style is always level 0)
          if (bulletHistoryByLevel[0]) {
            bulletHistoryByLevel[0] = [];
          }
        }

        if (bulletText.length > 0) {
          // Inicializar historial del nivel 0 si no existe
          if (!bulletHistoryByLevel[0]) {
            bulletHistoryByLevel[0] = [];
          }
          
          // Add current bullet to history
          bulletHistoryByLevel[0].push(bulletText);
          
          // Create a slide with all bullets accumulated so far
          processedText.push({
            id: globalIndex++,
            title: title,
            subtitle: section.subtitle,
            sentence: bulletText, // El bullet actual
            isBulletPoint: true,
            bulletHistory: [...(bulletHistoryByLevel[0] || []).slice(0, -1)], // Todos los bullets anteriores
          });
        }
      } else if (trimmedLine.length > 0) {
        // Regular paragraph line
        // Reset bullet history when we encounter regular text
        const hasAnyBullets = Object.keys(bulletHistoryByLevel).length > 0;
        if (hasAnyBullets) {
          Object.keys(bulletHistoryByLevel).forEach(level => {
            delete bulletHistoryByLevel[parseInt(level)];
          });
        }
        currentParagraph.push(trimmedLine);
      } else {
        // Empty line - process accumulated paragraph
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.join(' ').trim();
          if (paragraphText.length > 0) {
            // Remove markdown formatting
            const cleanText = paragraphText
              .replace(/\*\*/g, '')
              .replace(/\*/g, '')
              .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
            
            // Split into sentences
            const sentences = cleanText.match(/[^.!?]+[.!?]/g) || [];
            if (sentences.length > 0) {
              for (const sentence of sentences) {
                const trimmedSentence = sentence.trim();
                if (trimmedSentence.length > 0) {
                  processedText.push({
                    id: globalIndex++,
                    title: title,
                    subtitle: section.subtitle,
                    sentence: trimmedSentence,
                  });
                }
              }
            } else if (cleanText.length > 0) {
              processedText.push({
                id: globalIndex++,
                title: title,
                subtitle: section.subtitle,
                sentence: cleanText,
              });
            }
          }
          currentParagraph = [];
        }
      }
    }

    // Process remaining paragraph
    if (currentParagraph.length > 0) {
      const paragraphText = currentParagraph.join(' ').trim();
      if (paragraphText.length > 0) {
        // Remove markdown formatting
        const cleanText = paragraphText
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
        
        // Split into sentences
        const sentences = cleanText.match(/[^.!?]+[.!?]/g) || [];
        if (sentences.length > 0) {
          for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();
            if (trimmedSentence.length > 0) {
              processedText.push({
                id: globalIndex++,
                title: title,
                subtitle: section.subtitle,
                sentence: trimmedSentence,
              });
            }
          }
        } else if (cleanText.length > 0) {
          processedText.push({
            id: globalIndex++,
            title: title,
            subtitle: section.subtitle,
            sentence: cleanText,
          });
        }
      }
    }
  }

  return processedText;
}

