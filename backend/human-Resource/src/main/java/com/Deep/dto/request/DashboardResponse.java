package com.Deep.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private Long totalEmployees;

    private Long presentToday;

    private Long employeesOnLeave;

    private Long payrollGenerated;
}
