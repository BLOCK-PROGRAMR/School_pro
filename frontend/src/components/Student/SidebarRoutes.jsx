import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import StudentDetails from './StudentDetails';
import Notice from './Notice';
import Transport from './Transport';
import TimeTable from './TimeTable';
import ExamSyllabus from './ExamSyllabus';
import ExamMarks from './ExamMarks';
import OnlineTestLink from './OnlineTestLink';
import FeeLedger from './FeeLedger';
import FeePaySchedule from './FeePaySchedule';
import Gallery from './Gallery';

const SidebarRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="details" element={<StudentDetails />} />
      <Route path="notice" element={<Notice />} />
      <Route path="transport" element={<Transport />} />
      <Route path="exams/timetable" element={<TimeTable />} />
      <Route path="exams/syllabus" element={<ExamSyllabus />} />
      <Route path="exams/marks" element={<ExamMarks />} />
      <Route path="exams/online-test" element={<OnlineTestLink />} />
      <Route path="fees/ledger" element={<FeeLedger />} />
      <Route path="fees/schedule" element={<FeePaySchedule />} />
      <Route path="fees/gallery" element={<Gallery />} />
    </Routes>
  );
};

export default SidebarRoutes;