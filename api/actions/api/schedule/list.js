/**
 * Created by yons on 16/3/29.
 */
import {listGenerator} from '../../lib/util';

export default function list(req) {
  if (req.query.type === 'patient') {
    return listGenerator(req, 'PatientSchedule', null, {populate: 'creator', sort: {schedule_date: -1}});
  } else {
    const hospital = req.headers["x-hospital"];
    const args = {hospital, deleted: false, is_template: false};
    return listGenerator(req, 'DoctorSchedule', [args], {deepPopulate: 'creator items.doctor', sort: {schedule_week: -1}});
  }
}
