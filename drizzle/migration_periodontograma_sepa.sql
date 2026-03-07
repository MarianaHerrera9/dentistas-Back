-- =====================================================
-- Migration: Periodontograma — Replicar SEPA
-- Fecha: 2026-03-05
-- =====================================================

-- 1. Agregar columna 'ausente' para marcar dientes ausentes
ALTER TABLE periodontograma_detalles
  ADD COLUMN ausente TINYINT(1) DEFAULT 0 AFTER numero_diente;

-- 2. Agregar columna 'pronostico_individual' (Bueno, Dudoso, Malo, Imposible)
ALTER TABLE periodontograma_detalles
  ADD COLUMN pronostico_individual ENUM('bueno','dudoso','malo','imposible') DEFAULT NULL AFTER furca;

-- 3. Agregar columna 'nota' para texto libre por diente
ALTER TABLE periodontograma_detalles
  ADD COLUMN nota TEXT DEFAULT NULL AFTER encia_queratinizada;

-- 4. Cambiar sangrado de tinyint(1) (bool) a tinyint para soportar grados 0-3
--    Valores existentes (0/1) siguen siendo válidos
ALTER TABLE periodontograma_detalles
  MODIFY COLUMN sangrado_m TINYINT DEFAULT 0,
  MODIFY COLUMN sangrado_c TINYINT DEFAULT 0,
  MODIFY COLUMN sangrado_d TINYINT DEFAULT 0;
