import { StyleSheet } from 'react-native';
import { C } from '../constants';

export const S = StyleSheet.create({
  flex1:     { flex: 1, backgroundColor: C.carvao },
  container: { flex: 1, backgroundColor: C.carvao },

  // TopBar
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 44, paddingBottom: 12,
    backgroundColor: C.fumo, borderBottomWidth: 1, borderBottomColor: '#3d2510',
  },
  backBtn:      { color: C.brasa, fontSize: 14, fontWeight: '700' },
  topBarTitle:  { color: C.branco, fontSize: 16, fontWeight: '800' },
  topBarCount:  { color: C.brasa2, fontSize: 16, fontWeight: '800', minWidth: 40, textAlign: 'right' },
  eventoNome:   { color: C.cinza, textAlign: 'center', fontSize: 13, padding: 10, backgroundColor: C.fumo, borderBottomWidth: 1, borderBottomColor: '#2d1a0a' },

  // Inputs
  input: {
    backgroundColor: C.carvao, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, color: C.branco, fontSize: 15, borderWidth: 1, borderColor: '#5a3010',
  },
  inputAdd: {
    flex: 1, backgroundColor: C.fumo, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, color: C.branco, fontSize: 15, borderWidth: 1, borderColor: '#5a3010',
  },
  inputHint: { color: '#6a4a30', fontSize: 11, marginTop: 4 },

  // Botões
  btnPrimary:     { backgroundColor: C.brasa, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginHorizontal: 16, marginTop: 8, elevation: 8 },
  btnPrimaryText: { color: '#fff', fontWeight: '900', fontSize: 15, letterSpacing: 1.5 },
  btnSecondary:     { backgroundColor: C.fumo2, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: C.brasa },
  btnSecondaryText: { color: C.brasa, fontWeight: '700', fontSize: 14 },
  btnDanger:     { borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 10, marginBottom: 8, borderWidth: 1, borderColor: '#5a3010' },
  btnDangerText: { color: '#8a6a50', fontWeight: '700', fontSize: 14 },
  btnShare:      { backgroundColor: '#25D36622', borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#25D366' },
  btnShareText:  { color: '#25D366', fontWeight: '800', fontSize: 14 },

  // Cards
  card: { backgroundColor: C.fumo, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#4d2e10' },
  cardLabel: { color: C.brasa2, fontSize: 13, fontWeight: '700', marginBottom: 6, marginTop: 12, letterSpacing: 1 },
  itemsCard: { backgroundColor: C.fumo, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#3d2510' },

  // Lista
  listFlex:  { flex: 1 },
  emptyBox:  { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyText: { color: '#6a4a30', fontSize: 14 },

  // Convidado
  convidadoRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.fumo, borderRadius: 10, padding: 12, marginBottom: 6, borderWidth: 1, borderColor: '#3d2510' },
  convidadoIndex: { width: 24, fontWeight: '700', fontSize: 12 },
  convidadoEmoji: { fontSize: 16, marginRight: 8 },
  convidadoNome:  { flex: 1, color: C.branco, fontSize: 14 },
  convidadoCat:   { fontSize: 10, fontWeight: '600', marginRight: 8 },
  removeBtn: { color: '#8a4a30', fontSize: 16, paddingLeft: 6 },

  // Categorias
  catRow:       { flexDirection: 'row', paddingVertical: 10, gap: 8 },
  catBtn:       { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#4d2e10', backgroundColor: C.fumo },
  catEmoji:     { fontSize: 18 },
  catLabel:     { color: C.cinza, fontSize: 10, marginTop: 2, fontWeight: '600' },
  catResumo:    { flexDirection: 'row', justifyContent: 'center', gap: 16, paddingBottom: 8 },
  catResumoText:{ fontSize: 15, fontWeight: '700' },

  // Add row
  addRow: { flexDirection: 'row', paddingVertical: 14, gap: 10 },
  btnAdd:     { backgroundColor: C.brasa, borderRadius: 10, width: 48, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  btnAddText: { color: '#fff', fontSize: 26, fontWeight: '700', lineHeight: 30 },

  // Cardápio
  cardapioHint:   { color: '#6a4a30', fontSize: 12, marginBottom: 14, textAlign: 'center' },
  cardapioRow:    { flexDirection: 'row', alignItems: 'center', backgroundColor: C.fumo, borderRadius: 10, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: '#3d2510', gap: 8 },
  cardapioRowOff: { opacity: 0.45 },
  cardapioEmoji:  { fontSize: 18, width: 28 },
  cardapioLabel:  { flex: 1, color: C.cinza, fontSize: 13 },
  cardapioAcoes:  { flexDirection: 'row', gap: 6 },
  tagBtn:     { backgroundColor: '#3d2510', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  tagBtnText: { color: C.brasa2, fontSize: 11, fontWeight: '700' },
  bottomBar:  { padding: 16, backgroundColor: C.carvao, borderTopWidth: 1, borderTopColor: '#2d1a0a' },

  // Modal
  modalOverlay:      { flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center' },
  modalBox:          { backgroundColor: C.fumo, borderRadius: 16, padding: 24, width: '85%', borderWidth: 1, borderColor: C.brasa },
  modalTitle:        { color: C.brasa2, fontWeight: '800', fontSize: 16, marginBottom: 4 },
  modalSub:          { color: '#6a4a30', fontSize: 12, marginBottom: 14 },
  modalInput:        { backgroundColor: C.carvao, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, color: C.branco, fontSize: 16, borderWidth: 1, borderColor: '#5a3010', marginBottom: 16 },
  modalBtns:         { flexDirection: 'row', gap: 10 },
  modalBtnCancel:     { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#5a3010', alignItems: 'center' },
  modalBtnCancelText: { color: '#8a6a50', fontWeight: '700' },
  modalBtnOk:     { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: C.brasa, alignItems: 'center' },
  modalBtnOkText: { color: '#fff', fontWeight: '800' },

  // Resultado
  resultContent: { padding: 20, paddingTop: 44, paddingBottom: 40 },
  resultTitle:   { color: C.brasa, fontSize: 22, fontWeight: '900', textAlign: 'center' },
  catBadgeRow:   { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' },
  catBadge:      { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  catBadgeText:  { fontSize: 12, fontWeight: '700' },

  financeCard:   { backgroundColor: C.fumo2, borderRadius: 16, padding: 18, marginBottom: 20, borderWidth: 1.5, borderColor: C.brasa },
  financeOk:     { borderColor: C.verde },
  financeWarn:   { borderColor: C.vermelho },
  financeTitle:  { color: C.brasa2, fontWeight: '800', fontSize: 13, letterSpacing: 2, marginBottom: 12 },
  financeRow:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  financeSaldo:  { marginTop: 4 },
  financeLabel:  { color: C.cinza, fontSize: 14 },
  financeValue:  { color: C.branco, fontWeight: '700', fontSize: 14 },
  saldoPos:      { color: C.verde },
  saldoNeg:      { color: C.vermelho },
  progressBar:   { height: 8, backgroundColor: '#1a0a00', borderRadius: 4, marginVertical: 8, overflow: 'hidden' },
  progressFill:  { height: '100%', borderRadius: 4 },
  progressLabel: { color: '#6a4a30', fontSize: 11, textAlign: 'right', marginBottom: 8 },
  rateioDivider: { borderTopWidth: 1, borderTopColor: '#4d2e10', marginVertical: 12 },
  rateioText:    { color: C.cinza, fontSize: 14, textAlign: 'center' },
  rateioValor:   { color: C.brasa2, fontWeight: '900', fontSize: 16 },

  sectionTitle: { color: C.brasa2, fontSize: 12, fontWeight: '800', letterSpacing: 2.5, marginTop: 20, marginBottom: 8 },
  itemRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#2d1a0a' },
  itemEmoji:    { fontSize: 18, width: 30 },
  itemLabel:    { flex: 1, color: C.cinza, fontSize: 13 },
  itemRight:    { alignItems: 'flex-end' },
  itemValor:    { color: C.branco, fontWeight: '700', fontSize: 13 },
  itemCusto:    { color: '#6a4a30', fontSize: 11 },

  guestItem:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#2d1a0a' },
  guestIndex: { color: C.brasa, width: 22, fontSize: 12, fontWeight: '700' },
  guestEmoji: { fontSize: 14, marginRight: 8 },
  guestName:  { flex: 1, color: C.branco, fontSize: 14 },
  guestCat:   { fontSize: 10, fontWeight: '600', marginRight: 8 },
  guestChk:   { color: C.verde, fontSize: 14 },

  dicaCard:  { backgroundColor: '#1f1000', borderRadius: 14, padding: 16, marginTop: 20, borderWidth: 1, borderColor: '#4d2e10', borderStyle: 'dashed' },
  dicaTitle: { color: C.brasa2, fontWeight: '800', fontSize: 13, letterSpacing: 1, marginBottom: 10 },
  dicaText:  { color: '#8a6a50', fontSize: 13, marginBottom: 4 },

  historicoRow:     { backgroundColor: C.fumo, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#3d2510' },
  historicoNome:    { color: C.branco, fontWeight: '800', fontSize: 15, marginBottom: 6 },
  historicoInfo:    { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  historicoData:    { color: '#6a4a30', fontSize: 12 },
  historicoPessoas: { color: C.cinza, fontSize: 12 },
  historicoCusto:   { color: C.brasa2, fontSize: 12, fontWeight: '700', marginLeft: 'auto' },

  // Home
  homeContent: { padding: 24, paddingTop: 52, paddingBottom: 40 },
  headerBrand: { alignItems: 'center', marginBottom: 36 },
  flame:       { fontSize: 72, marginBottom: 8 },
  brandTitle:  { fontSize: 24, fontWeight: '900', color: C.brasa, letterSpacing: 2, textAlign: 'center', textShadowColor: C.brasa2, textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 12 },
  brandSub:    { fontSize: 13, color: C.cinza, letterSpacing: 3, marginTop: 4 },
});