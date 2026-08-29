const fs = require('fs');
const css = fs.readFileSync('src/components/admin/ActivityLog.css', 'utf8');

const start = css.indexOf('/* Performed by meta (used in activity-meta-row) */');
const end = css.indexOf('/* ============================================\n   LOADING SKELETON');

if (start === -1 || end === -1) {
  console.log('Not found');
  process.exit(1);
}

const oldSection = css.substring(start, end);

const newSection = '/* Performed by meta (used in activity-meta-row) */\n' +
'.activity-performed {\n' +
'  display: inline-flex;\n' +
'  align-items: center;\n' +
'  gap: 5px;\n' +
'  font-size: 0.625rem;\n' +
'  color: #94a3b8;\n' +
'  font-weight: 500;\n' +
'}\n\n' +
'/* ============================================\n' +
'   MODAL \u2014 Premium Compact Redesign\n' +
'   ============================================ */\n' +
'.modal-overlay {\n' +
'  position: fixed;\n' +
'  inset: 0;\n' +
'  background: rgba(15, 23, 42, 0.45);\n' +
'  backdrop-filter: blur(4px);\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  justify-content: center;\n' +
'  padding: 20px;\n' +
'  z-index: 1000;\n' +
'  animation: modal-fade-in 0.2s ease;\n' +
'}\n\n' +
'@keyframes modal-fade-in {\n' +
'  from { opacity: 0; }\n' +
'  to { opacity: 1; }\n' +
'}\n\n' +
'.modal-content {\n' +
'  background: #ffffff;\n' +
'  border-radius: 14px;\n' +
'  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.18), 0 8px 20px -8px rgba(0, 0, 0, 0.08);\n' +
'  max-width: 600px;\n' +
'  width: 100%;\n' +
'  max-height: 85vh;\n' +
'  overflow: hidden;\n' +
'  animation: modal-slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1);\n' +
'}\n\n' +
'@keyframes modal-slide-up {\n' +
'  from { opacity: 0; transform: translateY(20px) scale(0.98); }\n' +
'  to { opacity: 1; transform: translateY(0) scale(1); }\n' +
'}\n\n' +
'.modal-header {\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  gap: 14px;\n' +
'  padding: 18px 22px;\n' +
'  border-bottom: 1px solid #f1f5f9;\n' +
'  background: linear-gradient(135deg, #fafbfc 0%, #f5f6ff 100%);\n' +
'}\n\n' +
'.modal-icon {\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  justify-content: center;\n' +
'  width: 42px;\n' +
'  height: 42px;\n' +
'  border-radius: 12px;\n' +
'  flex-shrink: 0;\n' +
'  box-shadow: 0 3px 10px -2px rgba(0, 0, 0, 0.07);\n' +
'}\n\n' +
'.modal-icon.green {\n' +
'  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);\n' +
'  color: #16a34a;\n' +
'}\n\n' +
'.modal-icon.slate {\n' +
'  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);\n' +
'  color: #64748b;\n' +
'}\n\n' +
'.modal-icon.indigo {\n' +
'  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);\n' +
'  color: #6366f1;\n' +
'}\n\n' +
'.modal-icon.amber {\n' +
'  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);\n' +
'  color: #d97706;\n' +
'}\n\n' +
'.modal-icon.red {\n' +
'  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);\n' +
'  color: #dc2626;\n' +
'}\n\n' +
'.modal-title-section {\n' +
'  flex: 1;\n' +
'  min-width: 0;\n' +
'}\n\n' +
'.modal-title-row {\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  gap: 10px;\n' +
'  flex-wrap: wrap;\n' +
'  margin-bottom: 3px;\n' +
'}\n\n' +
'.modal-title {\n' +
'  margin: 0;\n' +
'  font-size: 1rem;\n' +
'  font-weight: 700;\n' +
'  color: #0f172a;\n' +
'  line-height: 1.3;\n' +
'}\n\n' +
'.modal-action-type {\n' +
'  font-size: 0.5625rem;\n' +
'  font-weight: 600;\n' +
'  color: #64748b;\n' +
'  text-transform: uppercase;\n' +
'  letter-spacing: 0.4px;\n' +
'  background: #f1f5f9;\n' +
'  padding: 2px 7px;\n' +
'  border-radius: 5px;\n' +
'}\n\n' +
'.modal-badge {\n' +
'  display: inline-flex;\n' +
'  align-items: center;\n' +
'  padding: 3px 10px;\n' +
'  border-radius: 999px;\n' +
'  font-size: 0.5625rem;\n' +
'  font-weight: 700;\n' +
'  text-transform: uppercase;\n' +
'  letter-spacing: 0.35px;\n' +
'  box-shadow: 0 1px 2px -1px rgba(0, 0, 0, 0.06);\n' +
'}\n\n' +
'.modal-badge.green {\n' +
'  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);\n' +
'  color: #16a34a;\n' +
'}\n\n' +
'.modal-badge.slate {\n' +
'  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);\n' +
'  color: #64748b;\n' +
'}\n\n' +
'.modal-badge.indigo {\n' +
'  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);\n' +
'  color: #4f46e5;\n' +
'}\n\n' +
'.modal-badge.amber {\n' +
'  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);\n' +
'  color: #b45309;\n' +
'}\n\n' +
'.modal-badge.red {\n' +
'  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);\n' +
'  color: #dc2626;\n' +
'}\n\n' +
'.modal-close {\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  justify-content: center;\n' +
'  width: 32px;\n' +
'  height: 32px;\n' +
'  border: none;\n' +
'  background: #f1f5f9;\n' +
'  color: #64748b;\n' +
'  border-radius: 8px;\n' +
'  cursor: pointer;\n' +
'  transition: all 0.15s ease;\n' +
'  flex-shrink: 0;\n' +
'}\n\n' +
'.modal-close:hover {\n' +
'  background: #e2e8f0;\n' +
'  color: #0f172a;\n' +
'}\n\n' +
'.modal-close:focus-visible {\n' +
'  outline: 2px solid #6366f1;\n' +
'  outline-offset: 2px;\n' +
'}\n\n' +
'.modal-body {\n' +
'  padding: 22px 22px;\n' +
'  max-height: 60vh;\n' +
'  overflow-y: auto;\n' +
'}\n\n' +
'.detail-sections-grid {\n' +
'  display: grid;\n' +
'  grid-template-columns: 1fr;\n' +
'  gap: 20px;\n' +
'}\n\n' +
'@media (min-width: 560px) {\n' +
'  .detail-sections-grid {\n' +
'    grid-template-columns: repeat(2, 1fr);\n' +
'  }\n' +
'}\n\n' +
'.detail-section {\n' +
'  background: #fafbfc;\n' +
'  border: 1px solid #f1f5f9;\n' +
'  border-radius: 10px;\n' +
'  padding: 18px;\n' +
'  transition: border-color 0.15s ease, box-shadow 0.15s ease;\n' +
'}\n\n' +
'.detail-section:hover {\n' +
'  border-color: #e2e8f0;\n' +
'  box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.06);\n' +
'}\n\n' +
'.detail-section-header {\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  gap: 8px;\n' +
'  margin-bottom: 14px;\n' +
'  padding-bottom: 10px;\n' +
'  border-bottom: 1px solid #f1f5f9;\n' +
'}\n\n' +
'.detail-section-icon {\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  justify-content: center;\n' +
'  width: 26px;\n' +
'  height: 26px;\n' +
'  border-radius: 7px;\n' +
'  background: #f1f5f9;\n' +
'  color: #6366f1;\n' +
'  flex-shrink: 0;\n' +
'}\n\n' +
'.detail-section h4 {\n' +
'  margin: 0;\n' +
'  font-size: 0.6875rem;\n' +
'  font-weight: 700;\n' +
'  color: #0f172a;\n' +
'  text-transform: uppercase;\n' +
'  letter-spacing: 0.45px;\n' +
'}\n\n' +
'.detail-fields {\n' +
'  display: flex;\n' +
'  flex-direction: column;\n' +
'  gap: 10px;\n' +
'}\n\n' +
'.detail-field {\n' +
'  display: grid;\n' +
'  grid-template-columns: 1fr;\n' +
'  gap: 3px;\n' +
'}\n\n' +
'@media (min-width: 380px) {\n' +
'  .detail-field {\n' +
'    grid-template-columns: 90px 1fr;\n' +
'    align-items: start;\n' +
'  }\n' +
'}\n\n' +
'.detail-field-label {\n' +
'  font-size: 0.625rem;\n' +
'  font-weight: 600;\n' +
'  color: #64748b;\n' +
'  line-height: 1.4;\n' +
'  white-space: nowrap;\n' +
'}\n\n' +
'@media (min-width: 380px) {\n' +
'  .detail-field-label {\n' +
'    padding-top: 1px;\n' +
'    padding-right: 12px;\n' +
'  }\n' +
'}\n\n' +
'.detail-field-value {\n' +
'  font-size: 0.75rem;\n' +
'  color: #0f172a;\n' +
'  word-break: break-word;\n' +
'  font-family: inherit;\n' +
'  line-height: 1.45;\n' +
'  font-weight: 500;\n' +
'}\n\n' +
'.detail-field-value code {\n' +
'  font-size: 0.6875rem;\n' +
'  background: #f1f5f9;\n' +
'  padding: 1px 5px;\n' +
'  border-radius: 4px;\n' +
'  font-family: \'SF Mono\', \'Consolas\', monospace;\n' +
'}\n\n' +
'.status-badge {\n' +
'  display: inline-flex;\n' +
'  align-items: center;\n' +
'  gap: 4px;\n' +
'  padding: 2px 8px;\n' +
'  border-radius: 999px;\n' +
'  font-size: 0.5625rem;\n' +
'  font-weight: 700;\n' +
'  text-transform: uppercase;\n' +
'  letter-spacing: 0.35px;\n' +
'  box-shadow: 0 1px 2px -1px rgba(0, 0, 0, 0.06);\n' +
'}\n\n' +
'.status-badge.successful {\n' +
'  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);\n' +
'  color: #16a34a;\n' +
'}\n\n' +
'.status-badge.completed {\n' +
'  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);\n' +
'  color: #dc2626;\n' +
'}\n\n' +
'.status-badge.successful::before {\n' +
'  content: \'\';\n' +
'  width: 5px;\n' +
'  height: 5px;\n' +
'  border-radius: 50%;\n' +
'  background: currentColor;\n' +
'  flex-shrink: 0;\n' +
'}\n\n' +
'.modal-footer {\n' +
'  display: flex;\n' +
'  justify-content: flex-end;\n' +
'  padding: 16px 22px;\n' +
'  border-top: 1px solid #f1f5f9;\n' +
'  background: #fafbfc;\n' +
'  border-radius: 0 0 14px 14px;\n' +
'}\n\n' +
'.modal-close-btn {\n' +
'  border: 1px solid #e2e8f0;\n' +
'  background: #ffffff;\n' +
'  color: #475569;\n' +
'  border-radius: 999px;\n' +
'  padding: 8px 20px;\n' +
'  font-size: 0.6875rem;\n' +
'  font-weight: 600;\n' +
'  font-family: inherit;\n' +
'  cursor: pointer;\n' +
'  transition: all 0.2s ease;\n' +
'  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);\n' +
'}\n\n' +
'.modal-close-btn:hover {\n' +
'  border-color: #c7d2fe;\n' +
'  color: #4f46e5;\n' +
'  background: #f5f6ff;\n' +
'}\n\n' +
'.modal-close-btn:focus-visible {\n' +
'  outline: 2px solid #6366f1;\n' +
'  outline-offset: 2px;\n' +
'}\n\n' +
'/* ============================================\n' +
'   LOADING SKELETON\n' +
'   ============================================ */';

const newCss = css.substring(0, start) + newSection + css.substring(end);
fs.writeFileSync('src/components/admin/ActivityLog.css', newCss);
console.log('CSS updated successfully');