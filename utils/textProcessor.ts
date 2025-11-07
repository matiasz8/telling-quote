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
    let bulletHistory: string[] = []; // Acumula los bullets de la lista actual
    let lastParentBullet: string | null = null; // Guarda el último bullet de nivel 0

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
        // Reset bullet history when we encounter an empty line
        bulletHistory = [];
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
          // Reset bullet history when starting a new bullet list
          bulletHistory = [];
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
          // Guardar el bullet padre si es de nivel 0
          if (indentLevel === 0) {
            lastParentBullet = bulletText;
          }
          
          // Add current bullet to history
          bulletHistory.push(bulletText);
          
          // Create a slide with all bullets accumulated so far
          processedText.push({
            id: globalIndex++,
            title: title,
            subtitle: section.subtitle,
            sentence: bulletText, // El bullet actual
            isBulletPoint: true,
            isNumberedList: !!numberedMatch, // Marca si es lista numerada
            bulletHistory: [...bulletHistory.slice(0, -1)], // Todos los bullets anteriores
            indentLevel: indentLevel,
            parentBullet: indentLevel > 0 && lastParentBullet ? lastParentBullet : undefined,
          });
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
          // Reset bullet history when starting a new bullet list
          bulletHistory = [];
        }

        if (bulletText.length > 0) {
          // Add current bullet to history
          bulletHistory.push(bulletText);
          
          // Create a slide with all bullets accumulated so far
          processedText.push({
            id: globalIndex++,
            title: title,
            subtitle: section.subtitle,
            sentence: bulletText, // El bullet actual
            isBulletPoint: true,
            bulletHistory: [...bulletHistory.slice(0, -1)], // Todos los bullets anteriores
          });
        }
      } else if (trimmedLine.length > 0) {
        // Regular paragraph line
        // Reset bullet history when we encounter regular text
        if (bulletHistory.length > 0) {
          bulletHistory = [];
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

